import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_items (
          workflow_id
        )
      `)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching collections:', error);
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }

    // Add workflow count to each collection
    const collectionsWithCount = data.map((collection) => ({
      ...collection,
      workflow_count: collection.collection_items?.length || 0
    }));

    return NextResponse.json(collectionsWithCount);
  } catch (ex) {
    console.error('Unexpected exception fetching collections:', ex);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
