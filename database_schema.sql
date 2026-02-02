-- Custom Workflow Requests Table
-- 定制工作流请求表

CREATE TABLE IF NOT EXISTS public.custom_workflow_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 基本信息
    name TEXT,  -- 姓名（可选）
    company_name TEXT,  -- 公司名称（可选）
    company_website TEXT,  -- 公司网站（可选）
    email TEXT NOT NULL,  -- 邮箱（必填）
    
    -- 项目信息
    budget_range TEXT NOT NULL,  -- 预算范围（必填）
    -- 可选值: 'under-1k', '1k-5k', '5k-10k', '10k-25k', '25k-50k', '50k-plus'
    
    message TEXT NOT NULL,  -- 项目描述（必填，10-2000字符）
    
    -- 状态管理
    status TEXT NOT NULL DEFAULT 'pending',  -- 状态: 'pending', 'contacted', 'in_progress', 'completed', 'cancelled'
    
    -- 内部备注（管理员使用）
    admin_notes TEXT,
    assigned_to TEXT,  -- 分配给哪个团队成员
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 索引
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT message_length CHECK (char_length(message) >= 10 AND char_length(message) <= 2000),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'cancelled')),
    CONSTRAINT valid_budget_range CHECK (budget_range IN ('under-1k', '1k-5k', '5k-10k', '10k-25k', '25k-50k', '50k-plus'))
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_custom_workflow_requests_email ON public.custom_workflow_requests(email);
CREATE INDEX IF NOT EXISTS idx_custom_workflow_requests_status ON public.custom_workflow_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_workflow_requests_created_at ON public.custom_workflow_requests(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_workflow_requests_updated_at 
    BEFORE UPDATE ON public.custom_workflow_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加注释
COMMENT ON TABLE public.custom_workflow_requests IS '定制工作流请求表，存储用户提交的定制工作流需求';
COMMENT ON COLUMN public.custom_workflow_requests.id IS '主键，UUID';
COMMENT ON COLUMN public.custom_workflow_requests.name IS '用户姓名（可选）';
COMMENT ON COLUMN public.custom_workflow_requests.company_name IS '公司名称（可选）';
COMMENT ON COLUMN public.custom_workflow_requests.company_website IS '公司网站（可选）';
COMMENT ON COLUMN public.custom_workflow_requests.email IS '用户邮箱（必填）';
COMMENT ON COLUMN public.custom_workflow_requests.budget_range IS '预算范围（必填）';
COMMENT ON COLUMN public.custom_workflow_requests.message IS '项目描述（必填，10-2000字符）';
COMMENT ON COLUMN public.custom_workflow_requests.status IS '请求状态：pending（待处理）、contacted（已联系）、in_progress（进行中）、completed（已完成）、cancelled（已取消）';
COMMENT ON COLUMN public.custom_workflow_requests.admin_notes IS '管理员备注';
COMMENT ON COLUMN public.custom_workflow_requests.assigned_to IS '分配给哪个团队成员';
COMMENT ON COLUMN public.custom_workflow_requests.created_at IS '创建时间';
COMMENT ON COLUMN public.custom_workflow_requests.updated_at IS '更新时间';

create table public.workflows (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  source_url text null,
  title text not null,
  slug text null,
  json_url text not null,
  summary_short text null,
  overview_md text null,
  features_md text null,
  use_cases_md text null,
  how_to_use_md text null,
  category text null,
  tags text[] null,
  stats jsonb null default '{"stars": 0, "views": 0, "downloads": 0}'::jsonb,
  overview_md_zh text null,
  features_md_zh text null,
  use_cases_md_zh text null,
  how_to_use_md_zh text null,
  category_zh text null,
  tags_zh text[] null,
  title_zh text null,
  summary_short_zh text null,
  is_verified boolean null default false,
  json_data jsonb null,
  origin_source text null,
  content_hash text null,
  constraint workflows_pkey primary key (id),
  constraint workflows_slug_key unique (slug)
) TABLESPACE pg_default;

create index IF not exists idx_workflows_verified on public.workflows using btree (is_verified) TABLESPACE pg_default;

create index IF not exists idx_workflows_category on public.workflows using btree (category) TABLESPACE pg_default;

create index IF not exists idx_workflows_content_hash on public.workflows using btree (content_hash) TABLESPACE pg_default;