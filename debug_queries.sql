请在Supabase SQL编辑器中执行以下查询来检查数据：

-- 检查collection_items表中的记录
SELECT * FROM collection_items WHERE collection_id = '015787a0-7e78-4627-a1fa-3bd1485e4d6a';

-- 检查对应的workflow是否存在
SELECT id, slug, title FROM workflows WHERE id = '019acaf1-f3fa-4e00-b063-b40783978179';

-- 检查workflows表的RLS设置
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'workflows' AND schemaname = 'public';

-- 如果workflows表启用了RLS但没有SELECT策略，添加它
-- ALTER TABLE "public"."workflows" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON "public"."workflows" FOR SELECT USING (true);
