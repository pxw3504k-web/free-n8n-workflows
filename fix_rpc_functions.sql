-- 修复 RPC 函数，返回完整的 workflows 记录
-- 在 Supabase SQL Editor 中运行

-- 1. 删除旧函数
DROP FUNCTION IF EXISTS get_weekly_trending_dynamic(int);
DROP FUNCTION IF EXISTS get_all_time_top_dynamic(int);
DROP FUNCTION IF EXISTS get_hybrid_trending(int);

-- 2. 创建新的 get_weekly_trending_dynamic 函数
-- 返回完整的 workflows 记录 + 计算的 hot_score
CREATE OR REPLACE FUNCTION get_weekly_trending_dynamic(limit_count int DEFAULT 20)
RETURNS SETOF workflows
LANGUAGE sql
STABLE
AS $$
  SELECT w.*
  FROM workflows w
  LEFT JOIN (
    -- 只统计过去 7 天的互动
    SELECT workflow_id, count(*) as real_events
    FROM workflow_events
    WHERE created_at > (now() - INTERVAL '7 days')
    GROUP BY workflow_id
  ) e ON w.id = e.workflow_id
  ORDER BY 
    -- 🔥 混合热度算法 🔥
    (
        -- Part A (Base): 历史存量浏览量 / 20 (作为基础热度，保证不为0)
        (COALESCE((w.stats->>'views')::int, 0) / 20) 
        + 
        -- Part B (Boost): 过去7天真实互动数 * 50 (极高权重)
        (COALESCE(e.real_events, 0) * 50)
    ) DESC
  LIMIT limit_count;
$$;

-- 3. 创建新的 get_all_time_top_dynamic 函数
-- 返回完整的 workflows 记录，按总下载量排序
CREATE OR REPLACE FUNCTION get_all_time_top_dynamic(limit_count int DEFAULT 20)
RETURNS SETOF workflows
LANGUAGE sql
STABLE
AS $$
  SELECT w.*
  FROM workflows w
  LEFT JOIN (
    -- 统计所有历史下载行为
    SELECT workflow_id, count(*) as real_downloads
    FROM workflow_events
    WHERE event_type IN ('download', 'copy_json')
    GROUP BY workflow_id
  ) e ON w.id = e.workflow_id
  ORDER BY 
    -- ⬇️ 混合总下载量算法 ⬇️
    (
        -- Part A: 历史迁移过来的存量数据 (Stats JSON 中的 downloads)
        COALESCE((w.stats->>'downloads')::int, 0)
        + 
        -- Part B: 新系统记录的真实下载与复制行为
        COALESCE(e.real_downloads, 0)
    ) DESC
  LIMIT limit_count;
$$;

-- 4. 创建 get_hybrid_trending 函数（首页 Trending Now 使用）
CREATE OR REPLACE FUNCTION get_hybrid_trending(limit_count int DEFAULT 6)
RETURNS SETOF workflows
LANGUAGE sql
STABLE
AS $$
  SELECT w.*
  FROM workflows w
  LEFT JOIN (
    -- 算出真实的互动数量 (仅限过去 7 天)
    SELECT workflow_id, count(*) as real_events
    FROM workflow_events
    WHERE created_at > (now() - INTERVAL '7 days')
    GROUP BY workflow_id
  ) e ON w.id = e.workflow_id
  ORDER BY 
    -- 🔥 混合权重公式 🔥
    -- Part A (Base): 随机生成的浏览量 / 20 (权重低，作为底噪)
    -- Part B (Boost): 真实互动数 * 50 (权重极高，1个真实点击顶1000个随机浏览)
    (COALESCE((w.stats->>'views')::int, 0) / 20) + (COALESCE(e.real_events, 0) * 50) DESC
  LIMIT limit_count;
$$;

-- 5. 确保必要的索引存在
CREATE INDEX IF NOT EXISTS idx_workflow_events_created_at ON workflow_events (created_at);
CREATE INDEX IF NOT EXISTS idx_workflow_events_type ON workflow_events (event_type);
CREATE INDEX IF NOT EXISTS idx_workflow_events_workflow_id ON workflow_events (workflow_id);

-- 6. 测试函数
-- SELECT * FROM get_weekly_trending_dynamic(6);
-- SELECT * FROM get_all_time_top_dynamic(20);
-- SELECT * FROM get_hybrid_trending(6);

