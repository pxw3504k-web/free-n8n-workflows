# Integration Pairs - SEO Combination Pages

This document explains the Integration Pairs feature for creating SEO-friendly combination pages.

## Overview

Integration Pairs are pages that showcase workflows connecting two specific apps or services (e.g., "Agile CRM + Schedule Trigger"). These pages help improve SEO by targeting long-tail keywords like "connect X to Y with n8n".

## 📁 Pages Created

1. **Directory Page**: `/integration` - Lists all integration combinations
2. **Detail Pages**: `/integration/[slug]` - Shows workflows for specific integration pairs

## Architecture

### 1. Type Definitions (`types/supabase.ts`)

```typescript
interface IntegrationPair {
  idx: number;
  slug: string;
  app_a: string;
  app_b: string;
  workflow_ids: string[] | string;  // Flexible to handle JSONB
  count: number;
  ai_description: string;
  updated_at: string;
}
```

### 2. Database Schema

Table: `integration_pairs`

- **id**: Serial primary key
- **idx**: Index number
- **slug**: URL-friendly identifier (e.g., "agile-crm-to-schedule-trigger")
- **app_a**: First app identifier
- **app_b**: Second app identifier
- **workflow_ids**: JSONB array of workflow UUIDs
- **count**: Number of workflows
- **ai_description**: AI-generated description for SEO
- **created_at/updated_at**: Timestamps

### 3. Data Functions (`src/lib/data.ts`)

Two new functions added:

- `getIntegrationPair(slug: string)`: Fetch integration pair by slug
- `getWorkflowsByIds(workflowIds: string[])`: Fetch workflows by ID array

### 4. Page Route (`src/app/integration/[slug]/page.tsx`)

Dynamic route that:
- Fetches integration pair data
- Parses workflow IDs (handles both string and array formats)
- Fetches associated workflows
- Generates SEO metadata
- Renders beautiful UI with WorkflowCard components

## Setup Instructions

### Database Schema

The `integration_pairs` table already exists in your Supabase database with the following structure:

```sql
create table public.integration_pairs (
  slug text not null,
  app_a text not null,
  app_b text not null,
  workflow_ids jsonb not null,
  count integer null default 0,
  ai_description text null,
  updated_at timestamp without time zone null default now(),
  constraint integration_pairs_pkey primary key (slug)
);

create index idx_integration_count on public.integration_pairs using btree (count desc);
```

### Import Your Data

You have clean data ready. Import it using the Supabase dashboard or API:

```sql
-- Format your data like this:
INSERT INTO public.integration_pairs (idx, slug, app_a, app_b, workflow_ids, count, ai_description, updated_at)
VALUES 
  (0, 'agile-crm-to-schedule-trigger', 'agile-crm', 'schedule-trigger', 
   '["uuid-1", "uuid-2"]'::jsonb, 2, 
   'Your AI description here', 
   '2026-01-05 03:12:57.416052');
```

### Test the Pages

Once your data is imported, test the pages:

1. **Directory Page**: Visit `/integration` to see all integration combinations
2. **Detail Pages**: Visit specific combinations like:
   - `/integration/agile-crm-to-schedule-trigger`
   - `/integration/slack-to-google-sheets`
   - `/integration/github-to-discord`

## Features

### SEO Optimization

✅ **Dynamic Metadata**
- Title format: "Connect [App A] and [App B] with n8n - [Count]+ Free Workflows (2026)"
- Meta description uses AI-generated description
- OpenGraph and Twitter cards
- Structured data (JSON-LD)

✅ **Keywords**
- Integration-specific keywords
- App names in various formats
- "automation", "workflow", "template" variations

✅ **Content Sections**
- Hero with visual connector
- Workflows grid
- About section with rich content
- FAQ-style benefits list

### UI Components

✅ **Hero Section**
- App names in gradient text
- Visual connector with icons
- Workflow count badge
- AI description

✅ **Workflows Grid**
- Reuses existing `WorkflowCard` component
- Consistent styling with rest of site
- Empty state for no workflows

✅ **SEO Content**
- Rich text section about the integration
- Benefits list
- Getting started guide
- Internal links to other pages

### Error Handling

✅ **Not Found Page**
- Custom 404 for missing integrations
- Links to homepage and search
- Consistent branding

✅ **Empty State**
- Friendly message when no workflows exist
- Call-to-action to submit workflows

## Data Format

Your cleaned data should follow this structure:

```json
{
  "idx": 0,
  "slug": "agile-crm-to-schedule-trigger",
  "app_a": "agile-crm",
  "app_b": "schedule-trigger",
  "workflow_ids": "[\"uuid-1\", \"uuid-2\"]",  // Can be string or array
  "count": 2,
  "ai_description": "Automate Agile CRM & Schedule Trigger with n8n...",
  "updated_at": "2026-01-05 03:12:57.416052"
}
```

## API Reference

### Data Functions (`src/lib/data.ts`)

#### `getIntegrationPairs(limit: number = 100)`

Fetches all integration pairs for the directory page, ordered by count (most popular first).

**Parameters:**
- `limit`: Maximum number of pairs to return (default: 100)

**Returns:**
- `Array<{ slug, app_a, app_b, count }>`

#### `getIntegrationPair(slug: string)`

Fetches a single integration pair by slug.

**Parameters:**
- `slug`: URL-friendly identifier (e.g., "agile-crm-to-schedule-trigger")

**Returns:**
- `IntegrationPair | null`

#### `getWorkflowsByIds(workflowIds: string[])`

Fetches multiple workflows by their IDs.

**Parameters:**
- `workflowIds`: Array of workflow UUID strings

**Returns:**
- `WorkflowData[]`

### Type Utilities (`types/supabase.ts`)

#### `parseIntegrationPair(pair: IntegrationPair)`

Utility function to ensure `workflow_ids` is always an array.

**Parameters:**
- `pair`: IntegrationPair object

**Returns:**
- `ParsedIntegrationPair` with workflow_ids as string[]

## URL Structure

### Directory Page
```
/integration
```
Lists all available integration combinations, ordered by popularity.

### Detail Pages
```
/integration/[slug]
```

Examples:
- `/integration/agile-crm-to-schedule-trigger`
- `/integration/slack-to-google-sheets`
- `/integration/gmail-to-notion`

## Performance

- Server-side rendering (SSR)
- Cached metadata generation
- Optimized database queries
- Reuses existing WorkflowCard component with memoization

## Next Steps

1. ✅ Run database migration
2. ✅ Import your cleaned data
3. ✅ Test a few integration pages
4. ✅ Verify SEO metadata (use view-source or SEO tools)
5. ✅ Add links to integration pages from other parts of the site
6. ✅ Create sitemap entries for all integration pages
7. ✅ Monitor Google Search Console for indexing

## Sitemap Integration

To add integration pairs to your sitemap, update `src/app/sitemap.ts`:

```typescript
// Fetch all integration pairs
const { data: integrationPairs } = await supabase
  .from('integration_pairs')
  .select('slug, updated_at')
  .order('updated_at', { ascending: false });

// Add to sitemap
const integrationUrls = (integrationPairs || []).map((pair) => ({
  url: `${siteUrl}/integration/${pair.slug}`,
  lastModified: pair.updated_at,
  changeFrequency: 'weekly' as const,
  priority: 0.7,
}));
```

## Troubleshooting

**Issue: workflow_ids is a string, not an array**
- Solution: The code handles both formats automatically. It parses JSON strings.

**Issue: Page shows 404**
- Check if the slug exists in the database
- Verify the integration_pairs table is created
- Check Supabase RLS policies allow public read

**Issue: No workflows displayed**
- Verify workflow UUIDs in workflow_ids actually exist in workflows table
- Check that getWorkflowsByIds returns data
- Look at browser console for errors

## Support

For questions or issues, please check:
1. Database connection and RLS policies
2. Environment variables (NEXT_PUBLIC_SUPABASE_URL, etc.)
3. Console logs for error messages
4. Supabase dashboard for query execution

Happy automating! 🚀

