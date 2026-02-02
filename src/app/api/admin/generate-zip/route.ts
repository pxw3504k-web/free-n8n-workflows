import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { Storage } from '@google-cloud/storage';
import { createClient } from '@supabase/supabase-js';

// Server-side API to pre-generate ZIP files for collections
export async function POST(req: Request) {
  try {
    const adminSecret = req.headers.get('x-admin-secret') || '';
    if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const collectionId = body?.collectionId;
    if (!collectionId) {
      return NextResponse.json({ success: false, error: 'Missing collectionId' }, { status: 400 });
    }

    // Initialize Supabase client.
    // Prefer service role key for admin operations; fall back to anon key if the service key isn't provided.
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl) {
      return NextResponse.json({ success: false, error: 'Supabase URL not configured' }, { status: 500 });
    }

    let supabaseAdmin;
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    } else if (supabaseAnonKey) {
      // Fallback to anon key (may be limited by RLS). We still attempt to proceed to make local/dev testing easier.
      console.warn('SUPABASE_SERVICE_ROLE_KEY not provided; falling back to anon key. This may fail due to RLS.');
      supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
    } else {
      return NextResponse.json({ success: false, error: 'Supabase admin credentials not configured' }, { status: 500 });
    }

    // Fetch collection metadata (slug)
    const { data: collectionRow, error: collectionError } = await supabaseAdmin
      .from('collections')
      .select('id,slug')
      .eq('id', collectionId)
      .single();
    if (collectionError || !collectionRow) {
      console.error('Failed to fetch collection', collectionError);
      return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
    }
    const collectionSlug = collectionRow.slug;

    // Fetch collection items with workflow slug and json_url
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('collection_items')
      .select('workflows(slug, json_url)')
      .eq('collection_id', collectionId);

    if (itemsError) {
      console.error('Failed to fetch collection items', itemsError);
      return NextResponse.json({ success: false, error: 'Failed to fetch collection items' }, { status: 500 });
    }

    const workflows = Array.isArray(itemsData)
      ? (itemsData as Array<{ workflows?: { slug?: string; json_url?: string } | null }>)
          .map((it) => it.workflows)
          .filter(Boolean) as Array<{ slug?: string; json_url?: string }>
      : [];
    if (!workflows || workflows.length === 0) {
      return NextResponse.json({ success: false, error: 'No workflows found for collection' }, { status: 400 });
    }

    // Initialize Google Cloud Storage
    const bucketName = process.env.GCS_BUCKET_NAME || '';
    if (!bucketName) {
      return NextResponse.json({ success: false, error: 'GCS_BUCKET_NAME not configured' }, { status: 500 });
    }

    let storage: Storage;
    if (process.env.GCS_CREDENTIALS) {
      try {
        const creds = JSON.parse(process.env.GCS_CREDENTIALS);
        storage = new Storage({ credentials: creds, projectId: creds.project_id });
      } catch (e) {
        console.error('Failed to parse GCS_CREDENTIALS', e);
        // fallback to default
        storage = new Storage();
      }
    } else {
      storage = new Storage();
    }

    const bucket = storage.bucket(bucketName);

    // Fetch all JSON files in parallel
    const fetchPromises = workflows.map(async (w: { slug?: string; json_url?: string }) => {
      const slug = w.slug || 'unknown';
      const url = w.json_url;
      if (!url) {
        return { slug, content: null, error: 'no json_url' };
      }
      try {
        const res = await fetch(url);
        if (!res.ok) {
          return { slug, content: null, error: `fetch failed ${res.status}` };
        }
        const text = await res.text();
        return { slug, content: text, error: null };
      } catch (e) {
        console.error('Error fetching json_url for', slug, e);
        return { slug, content: null, error: String(e) };
      }
    });

    const fetched = await Promise.all(fetchPromises);

    // Create ZIP
    const zip = new JSZip();
    fetched.forEach((item) => {
      if (item.content) {
        // ensure file name safe
        const filename = `${item.slug}.json`;
        zip.file(filename, item.content);
      } else {
        // add a small placeholder describing the error for traceability
        const filename = `${item.slug}.json`;
        zip.file(filename, JSON.stringify({ error: item.error || 'missing content' }));
      }
    });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Upload ZIP to GCS
    const destPath = `zips/${collectionSlug}.zip`;
    const file = bucket.file(destPath);
    await file.save(zipBuffer, {
      resumable: false,
      metadata: {
        contentType: 'application/zip',
      },
    });

    // Make public and build public URL
    try {
      await file.makePublic();
    } catch (e) {
      console.warn('makePublic failed, continuing', e);
    }
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURI(destPath)}`;

    // Update collection row with zip_url
    const { error: updateError } = await supabaseAdmin
      .from('collections')
      .update({ zip_url: publicUrl })
      .eq('id', collectionId);

    if (updateError) {
      console.error('Failed to update collection zip_url', updateError);
      // still return success but warn
      return NextResponse.json({ success: true, url: publicUrl, warning: 'Failed to update DB' });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Unexpected error in generate-zip route', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


