import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceRole) return null;
  return createClient(supabaseUrl, serviceRole);
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  try {
    const serverClient = getServerClient();
    if (!serverClient) {
      console.error('Supabase keys missing for event route');
      return NextResponse.json({ error: 'supabase_keys_missing' }, { status: 500 });
    }
    const resolvedParams = (params as Promise<{ slug: string }>);
    const { slug } = (resolvedParams && typeof resolvedParams.then === 'function') ? await resolvedParams : (params as { slug: string });
    const body = await req.json();
    const { type, anon_id = null, user_id = null } = body;

    if (!type || (type !== 'view' && type !== 'download')) {
      return NextResponse.json({ error: 'invalid_event_type' }, { status: 400 });
    }

    // find workflow id
    const { data: wf, error: wfErr } = await serverClient.from('workflows').select('id').eq('slug', slug).single();
    if (wfErr || !wf) {
      return NextResponse.json({ error: 'workflow_not_found' }, { status: 404 });
    }
    const workflowId = wf.id;

    // call rpc to increment event
    const { error } = await serverClient.rpc('increment_workflow_event', {
      _workflow: workflowId,
      _event: type,
      _user: user_id,
      _anon: anon_id,
    });

    if (error) {
      console.error('increment_workflow_event error', error);
      return NextResponse.json({ error: 'rpc_error' }, { status: 500 });
    }

    // return updated metrics
    const { data: metrics } = await serverClient.from('workflow_metrics').select('*').eq('workflow_id', workflowId).single();
    return NextResponse.json({ ok: true, metrics });
  } catch (err) {
    console.error('event route error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}


