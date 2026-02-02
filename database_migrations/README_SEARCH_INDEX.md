Recommendations for improving search performance (run on your Supabase/Postgres database):

1) Install the pg_trgm extension (for fuzzy matching / %LIKE% acceleration)

   -- Enable extension (run as a migration)
   CREATE EXTENSION IF NOT EXISTS pg_trgm;

2) Create GIN index on title and summary for faster text search (example for English fields)

   CREATE INDEX workflows_title_trgm_idx ON workflows USING gin (title gin_trgm_ops);
   CREATE INDEX workflows_summary_trgm_idx ON workflows USING gin (summary_short gin_trgm_ops);

3) Create tsvector column and GIN index for full-text search (weight title higher)

   -- Add tsvector column (if you want)
   ALTER TABLE workflows ADD COLUMN IF NOT EXISTS search_vector tsvector;

   -- Populate (one-off) and keep it maintained via trigger
   UPDATE workflows SET search_vector = 
     setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
     setweight(to_tsvector('english', coalesce(summary_short, '')), 'B');

   CREATE INDEX workflows_search_vector_idx ON workflows USING GIN (search_vector);

   -- Trigger example to keep tsvector up to date
   CREATE FUNCTION workflows_search_vector_trigger() RETURNS trigger AS $$
   begin
     new.search_vector :=
       setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
       setweight(to_tsvector('english', coalesce(new.summary_short, '')), 'B');
     return new;
   end
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
     ON workflows FOR EACH ROW EXECUTE PROCEDURE workflows_search_vector_trigger();

Notes:
- For Chinese content, consider using a Chinese text search extension or rely on pg_trgm for fuzzy matching.
- Run these migrations in a maintenance window; index creation can be IO intensive.


