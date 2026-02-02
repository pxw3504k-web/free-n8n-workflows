-- 更新 Trending RPC 函数，只返回已验证的工作流
-- 在 Supabase SQL Editor 中运行

-- 1. 删除旧函数
DROP FUNCTION IF EXISTS get_weekly_trending_dynamic(int);

-- 2. 创建新的 get_weekly_trending_dynamic 函数（只返回已验证的工作流）
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
  WHERE w.is_verified = true  -- 🔒 只返回已验证的工作流
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

-- 3. 更新 get_hybrid_trending 函数（也确保只返回已验证的工作流）
DROP FUNCTION IF EXISTS get_hybrid_trending(int);

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
  WHERE w.is_verified = true  -- 🔒 只返回已验证的工作流
  ORDER BY 
    -- 🔥 混合权重公式 🔥
    -- Part A (Base): 随机生成的浏览量 / 20 (权重低，作为底噪)
    -- Part B (Boost): 真实互动数 * 50 (权重极高，1个真实点击顶1000个随机浏览)
    (COALESCE((w.stats->>'views')::int, 0) / 20) + (COALESCE(e.real_events, 0) * 50) DESC
  LIMIT limit_count;
$$;

-- 4. 确保必要的索引存在（如果不存在则创建）
CREATE INDEX IF NOT EXISTS idx_workflow_events_created_at ON workflow_events (created_at);
CREATE INDEX IF NOT EXISTS idx_workflow_events_type ON workflow_events (event_type);
CREATE INDEX IF NOT EXISTS idx_workflow_events_workflow_id ON workflow_events (workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflows_is_verified ON workflows (is_verified) WHERE is_verified = true;

-- 5. 测试函数
-- SELECT * FROM get_weekly_trending_dynamic(20);
-- SELECT * FROM get_hybrid_trending(6);

-- 6. 验证查询：检查有多少已验证的工作流
-- SELECT COUNT(*) FROM workflows WHERE is_verified = true;

