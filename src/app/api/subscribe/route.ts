import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const source = typeof body?.source === 'string' ? body.source : 'footer';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    console.log('Subscribe API called with:', { email, source });

    // Try to use service role key first, fallback to anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const authKey = serviceKey || anonKey;

    if (!supabaseUrl || !authKey) {
      console.error('Supabase configuration missing');
      return NextResponse.json({
        success: false,
        error: 'Server not configured',
        details: { hasSupabaseUrl: !!supabaseUrl, hasAuthKey: !!authKey, usingServiceKey: !!serviceKey }
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, authKey, {
      auth: { persistSession: false }
    });

    console.log('Using auth method:', serviceKey ? 'service role key' : 'anon key (fallback)');

    // Try upsert operation
    console.log('Attempting upsert for subscriber:', { email, source });

    // Check if subscriber already exists
    const { data: existing, error: checkError } = await supabase
      .from('subscribers')
      .select('id, email, status')
      .eq('email', email)
      .single();

    let result;
    let error;

    if (existing) {
      // Update existing subscriber
      console.log('Updating existing subscriber');
      const { data, error: updateError } = await supabase
        .from('subscribers')
        .update({
          source,
          status: 'active'
        })
        .eq('email', email)
        .select()
        .single();

      result = data;
      error = updateError;
    } else {
      // Insert new subscriber
      console.log('Inserting new subscriber');
      const { data, error: insertError } = await supabase
        .from('subscribers')
        .insert({
          email,
          source,
          status: 'active'
        })
        .select()
        .single();

      result = data;
      error = insertError;
    }

    if (error) {
      console.error('Database operation failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to subscribe',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    console.log('Operation successful:', result);

    return NextResponse.json({ success: true, subscriber: result });
  } catch (err) {
    console.error('Unexpected error in subscribe route', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


