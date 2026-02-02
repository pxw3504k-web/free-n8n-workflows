-- Workflow metrics and events migration
-- Run this in Supabase SQL editor
begin;

-- Events table
create table if not exists public.workflow_events (
  id bigserial primary key,
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  event_type text not null, -- 'view' | 'download' | 'rating_change'
  user_id uuid,
  anon_id text,
  rating smallint,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Ratings table
create table if not exists public.workflow_ratings (
  id bigserial primary key,
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  user_id uuid,
  anon_id text,
  rating smallint not null check (rating >= 1 and rating <= 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (workflow_id, coalesce(user_id::text, anon_id))
);

-- Metrics table
create table if not exists public.workflow_metrics (
  workflow_id uuid primary key references public.workflows(id) on delete cascade,
  views_count bigint default 0 not null,
  downloads_count bigint default 0 not null,
  rating_sum bigint default 0 not null,
  rating_count bigint default 0 not null,
  average_rating numeric(3,2) default 0 not null,
  updated_at timestamptz default now()
);

-- RPC: increment event and update metrics atomically
create or replace function public.increment_workflow_event(
  _workflow uuid,
  _event text,
  _user uuid default null,
  _anon text default null
) returns void language plpgsql as $$
begin
  insert into public.workflow_events(workflow_id, event_type, user_id, anon_id)
    values (_workflow, _event, _user, _anon);

  if _event = 'view' then
    insert into public.workflow_metrics(workflow_id, views_count) values (_workflow, 1)
    on conflict (workflow_id) do update set views_count = public.workflow_metrics.views_count + 1, updated_at = now();
  elsif _event = 'download' then
    insert into public.workflow_metrics(workflow_id, downloads_count) values (_workflow, 1)
    on conflict (workflow_id) do update set downloads_count = public.workflow_metrics.downloads_count + 1, updated_at = now();
  end if;
end;
$$;

-- RPC: upsert rating and update aggregated metrics
create or replace function public.upsert_workflow_rating(
  _workflow uuid,
  _user uuid default null,
  _anon text default null,
  _rating smallint
) returns void language plpgsql as $$
declare
  prev_rating integer;
begin
  select rating into prev_rating from public.workflow_ratings
  where workflow_id = _workflow and coalesce(user_id::text, anon_id) = coalesce(_user::text, _anon) limit 1;

  if prev_rating is null then
    insert into public.workflow_ratings(workflow_id, user_id, anon_id, rating) values (_workflow, _user, _anon, _rating);
    insert into public.workflow_metrics(workflow_id, rating_sum, rating_count, average_rating) values (_workflow, _rating, 1, _rating::numeric)
    on conflict (workflow_id) do update set rating_sum = public.workflow_metrics.rating_sum + _rating, rating_count = public.workflow_metrics.rating_count + 1, average_rating = (public.workflow_metrics.rating_sum + _rating)::numeric / (public.workflow_metrics.rating_count + 1), updated_at = now();
  else
    update public.workflow_ratings set rating = _rating, updated_at = now()
      where workflow_id = _workflow and coalesce(user_id::text, anon_id) = coalesce(_user::text, _anon);

    update public.workflow_metrics set rating_sum = public.workflow_metrics.rating_sum - prev_rating + _rating, average_rating = (public.workflow_metrics.rating_sum - prev_rating + _rating)::numeric / public.workflow_metrics.rating_count, updated_at = now()
      where workflow_id = _workflow;
  end if;

  insert into public.workflow_events(workflow_id, event_type, user_id, anon_id, rating) values (_workflow, 'rating_change', _user, _anon, _rating);
end;
$$;

commit;


