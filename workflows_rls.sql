-- 允许所有人读取 workflows

ALTER TABLE "public"."workflows" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."workflows" FOR SELECT USING (true);
