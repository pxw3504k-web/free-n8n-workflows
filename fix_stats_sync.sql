-- 修复下载数同步问题
-- 修改 increment_workflow_event 函数，使其同时更新 workflows.stats JSON 字段
-- 在 Supabase SQL Editor 中运行

CREATE OR REPLACE FUNCTION public.increment_workflow_event(
  _workflow uuid,
  _event text,
  _user uuid default null,
  _anon text default null
) returns void language plpgsql as $$
declare
  current_stats jsonb;
  current_views bigint;
  current_downloads bigint;
  new_views bigint;
  new_downloads bigint;
begin
  -- 插入事件记录
  insert into public.workflow_events(workflow_id, event_type, user_id, anon_id)
    values (_workflow, _event, _user, _anon);

  -- 获取当前 workflows.stats
  select stats into current_stats from public.workflows where id = _workflow;
  
  -- 如果 stats 为空，初始化为空对象
  if current_stats is null then
    current_stats := '{}'::jsonb;
  end if;

  if _event = 'view' then
    -- 获取当前的 views 值（优先从 stats JSON，如果没有则从 workflow_metrics）
    current_views := coalesce((current_stats->>'views')::bigint, 0);
    select views_count into new_views from public.workflow_metrics where workflow_id = _workflow;
    if new_views is null then
      new_views := current_views;
    end if;
    
    -- 计算新的 views 值（取两者中的较大值 + 1，确保不会丢失数据）
    new_views := greatest(new_views, current_views) + 1;
    
    -- 更新 workflow_metrics
    insert into public.workflow_metrics(workflow_id, views_count) values (_workflow, new_views)
    on conflict (workflow_id) do update set views_count = new_views, updated_at = now();
    
    -- 同步更新 workflows.stats JSON 字段
    update public.workflows
    set stats = jsonb_set(
      coalesce(stats, '{}'::jsonb),
      '{views}',
      to_jsonb(new_views)
    )
    where id = _workflow;
    
  elsif _event = 'download' then
    -- 获取当前的 downloads 值（优先从 stats JSON，如果没有则从 workflow_metrics）
    current_downloads := coalesce((current_stats->>'downloads')::bigint, 0);
    select downloads_count into new_downloads from public.workflow_metrics where workflow_id = _workflow;
    if new_downloads is null then
      new_downloads := current_downloads;
    end if;
    
    -- 计算新的 downloads 值（取两者中的较大值 + 1，确保不会丢失数据）
    new_downloads := greatest(new_downloads, current_downloads) + 1;
    
    -- 更新 workflow_metrics
    insert into public.workflow_metrics(workflow_id, downloads_count) values (_workflow, new_downloads)
    on conflict (workflow_id) do update set downloads_count = new_downloads, updated_at = now();
    
    -- 同步更新 workflows.stats JSON 字段
    update public.workflows
    set stats = jsonb_set(
      coalesce(stats, '{}'::jsonb),
      '{downloads}',
      to_jsonb(new_downloads)
    )
    where id = _workflow;
  end if;
end;
$$;
