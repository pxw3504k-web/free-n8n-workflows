const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
  console.log('Starting export from', supabaseUrl);
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Export workflows
  console.log('Fetching workflows...');
  const { data: workflows, error: workflowsError } = await supabase
    .from('workflows')
    .select('*');

  if (workflowsError) {
    console.error('Error fetching workflows:', workflowsError.message);
  } else {
    const outputPath = path.join(dataDir, 'workflows.json');
    fs.writeFileSync(outputPath, JSON.stringify(workflows, null, 2));
    console.log(`Exported ${workflows.length} workflows to ${outputPath}`);
  }
}

exportData().catch(console.error);
