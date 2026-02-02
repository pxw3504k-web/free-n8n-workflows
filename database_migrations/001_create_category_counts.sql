-- Create a SQL function that returns category counts with English and Chinese names.
-- Run this in your Postgres / Supabase SQL editor.

-- Optional: create as a stable SQL function
CREATE OR REPLACE FUNCTION public.category_counts()
RETURNS TABLE(name_en text, name_zh text, count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT
    category AS name_en,
    category_zh AS name_zh,
    COUNT(*) AS count
  FROM public.workflows
  WHERE category IS NOT NULL
  GROUP BY category, category_zh
  ORDER BY COUNT(*) DESC;
$$;

-- Alternatively, create a view instead of a function:
-- CREATE MATERIALIZED VIEW public.view_category_counts AS
-- SELECT category AS name_en, category_zh AS name_zh, COUNT(*) AS count
-- FROM public.workflows
-- WHERE category IS NOT NULL
-- GROUP BY category, category_zh
-- ORDER BY count DESC;


