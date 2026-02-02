import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateNodeCount } from '@/lib/data';

export async function POST() {
  try {
    // Get all workflows with json_url
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('id, json_url')
      .not('json_url', 'is', null);

    if (error) {
      console.error('Error fetching workflows:', error);
      return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
    }

    if (!workflows || workflows.length === 0) {
      return NextResponse.json({ message: 'No workflows found' });
    }

    const updatePromises = workflows.map(async (workflow) => {
      try {
        if (!workflow.json_url) return null;

        const nodeCount = await calculateNodeCount(workflow.json_url);

        if (nodeCount > 0) {
          const { error: updateError } = await supabase
            .from('workflows')
            .update({ node_count: nodeCount })
            .eq('id', workflow.id);

          if (updateError) {
            console.error(`Failed to update workflow ${workflow.id}:`, updateError);
            return { id: workflow.id, error: updateError.message };
          }

          return { id: workflow.id, nodeCount, success: true };
        }

        return { id: workflow.id, nodeCount: 0, skipped: true };
      } catch (error) {
        console.error(`Error processing workflow ${workflow.id}:`, error);
        return { id: workflow.id, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    const results = await Promise.all(updatePromises);

    const successful = results.filter(r => r && 'success' in r && r.success);
    const skipped = results.filter(r => r && 'skipped' in r);
    const failed = results.filter(r => r && 'error' in r);

    return NextResponse.json({
      message: `Processed ${workflows.length} workflows`,
      successful: successful.length,
      skipped: skipped.length,
      failed: failed.length,
      results: results.filter(Boolean)
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
