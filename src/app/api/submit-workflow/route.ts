import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, nodes, author_name, author_url } = body || {};

    // Basic validation
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return NextResponse.json({ errorCode: 'title_too_short' }, { status: 400 });
    }

    if (!nodes) {
      return NextResponse.json({ errorCode: 'nodes_required' }, { status: 400 });
    }

    let parsedNodes: any = null;
    try {
      parsedNodes = typeof nodes === 'string' ? JSON.parse(nodes) : nodes;
    } catch (err) {
      return NextResponse.json({ errorCode: 'nodes_invalid_json' }, { status: 400 });
    }

    if (author_url && typeof author_url === 'string') {
      try {
        const u = new URL(author_url);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          return NextResponse.json({ errorCode: 'author_url_invalid' }, { status: 400 });
        }
      } catch (err) {
        return NextResponse.json({ errorCode: 'author_url_invalid' }, { status: 400 });
      }
    }

    // Insert into submissions table
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        title: title.trim(),
        description: description || null,
        nodes: typeof parsedNodes === 'string' ? parsedNodes : JSON.stringify(parsedNodes),
        author_name: author_name || null,
        author_url: author_url || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting submission:', error);
      return NextResponse.json({ errorCode: 'db_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Submit workflow API error:', err);
    return NextResponse.json({ errorCode: 'internal' }, { status: 500 });
  }
}


