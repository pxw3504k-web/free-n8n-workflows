/**
 * Import Integration Pairs Data
 * 
 * This script helps you import your cleaned integration pairs data into Supabase.
 * 
 * Usage:
 * 1. Place your JSON data in a file (e.g., integration_pairs_data.json)
 * 2. Update the DATA_FILE path below
 * 3. Run: npx tsx scripts/import_integration_pairs.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const DATA_FILE = path.join(process.cwd(), 'integration_pairs_data.json');

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface IntegrationPairInput {
  idx: number;
  slug: string;
  app_a: string;
  app_b: string;
  workflow_ids: string | string[];
  count: number;
  ai_description: string;
  updated_at?: string;
}

/**
 * Parse workflow_ids to ensure it's an array
 */
function parseWorkflowIds(workflowIds: string | string[]): string[] {
  if (Array.isArray(workflowIds)) {
    return workflowIds;
  }
  
  if (typeof workflowIds === 'string') {
    try {
      const parsed = JSON.parse(workflowIds);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  return [];
}

/**
 * Import integration pairs data
 */
async function importIntegrationPairs() {
  console.log('🚀 Starting Integration Pairs Import...\n');

  // Check if data file exists
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Data file not found: ${DATA_FILE}`);
    console.log('\n📝 Please create a JSON file with your integration pairs data.');
    console.log('Example format:');
    console.log(JSON.stringify([
      {
        idx: 0,
        slug: 'agile-crm-to-schedule-trigger',
        app_a: 'agile-crm',
        app_b: 'schedule-trigger',
        workflow_ids: '["uuid-1", "uuid-2"]',
        count: 2,
        ai_description: 'Your description here',
        updated_at: '2026-01-05 03:12:57.416052'
      }
    ], null, 2));
    process.exit(1);
  }

  // Read and parse data file
  let data: IntegrationPairInput[];
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    data = JSON.parse(fileContent);
    
    if (!Array.isArray(data)) {
      console.error('❌ Data file must contain an array of integration pairs');
      process.exit(1);
    }
    
    console.log(`📦 Found ${data.length} integration pairs to import\n`);
  } catch (error) {
    console.error('❌ Error reading data file:', error);
    process.exit(1);
  }

  // Validate and prepare data
  const preparedData = data.map((item) => ({
    idx: item.idx,
    slug: item.slug,
    app_a: item.app_a,
    app_b: item.app_b,
    workflow_ids: parseWorkflowIds(item.workflow_ids),
    count: item.count,
    ai_description: item.ai_description,
    updated_at: item.updated_at || new Date().toISOString(),
  }));

  // Import data in batches
  const BATCH_SIZE = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < preparedData.length; i += BATCH_SIZE) {
    const batch = preparedData.slice(i, i + BATCH_SIZE);
    
    console.log(`📤 Importing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)...`);
    
    const { data: result, error } = await supabase
      .from('integration_pairs')
      .upsert(batch, {
        onConflict: 'slug',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error(`❌ Error importing batch:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✅ Successfully imported ${batch.length} items`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors:  ${errorCount}`);
  console.log(`   📦 Total:   ${data.length}`);
  console.log('='.repeat(50) + '\n');

  // Verify data
  console.log('🔍 Verifying imported data...');
  const { count, error: countError } = await supabase
    .from('integration_pairs')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error verifying data:', countError);
  } else {
    console.log(`✅ Total records in database: ${count}\n`);
  }

  // Show sample records
  console.log('📋 Sample records:');
  const { data: samples, error: sampleError } = await supabase
    .from('integration_pairs')
    .select('slug, app_a, app_b, count')
    .limit(5);

  if (sampleError) {
    console.error('❌ Error fetching samples:', sampleError);
  } else {
    samples?.forEach((sample) => {
      console.log(`   • ${sample.app_a} + ${sample.app_b} (${sample.count} workflows) - /${sample.slug}`);
    });
  }

  console.log('\n✨ Import complete!\n');
  console.log('🌐 Test your pages at:');
  console.log(`   http://localhost:3000/integration/${samples?.[0]?.slug || 'your-slug'}\n`);
}

// Run the import
importIntegrationPairs().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});



