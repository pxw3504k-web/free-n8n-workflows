-- Support Orders Table
-- 支持订单表

CREATE TABLE IF NOT EXISTS public.support_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 订单信息
    order_no TEXT NOT NULL UNIQUE,  -- 订单号（唯一）
    amount DECIMAL(10, 2) NOT NULL,  -- 金额
    currency TEXT NOT NULL DEFAULT 'CNY',  -- 货币类型：CNY 或 USD
    
    -- 微信支付信息
    wechat_order_id TEXT,  -- 微信订单号（transaction_id）
    qr_code_url TEXT,  -- 支付二维码 URL
    
    -- 订单状态
    status TEXT NOT NULL DEFAULT 'pending',  -- 状态: 'pending', 'paid', 'expired', 'cancelled', 'failed'
    
    -- 错误信息
    error_message TEXT,  -- 错误消息（如果订单失败）
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,  -- 订单过期时间
    paid_at TIMESTAMP WITH TIME ZONE,  -- 支付完成时间
    
    -- 约束
    CONSTRAINT valid_status CHECK (status IN ('pending', 'paid', 'expired', 'cancelled', 'failed')),
    CONSTRAINT valid_currency CHECK (currency IN ('CNY', 'USD')),
    CONSTRAINT valid_amount CHECK (amount >= 1 AND amount <= 100)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_support_orders_order_no ON public.support_orders(order_no);
CREATE INDEX IF NOT EXISTS idx_support_orders_status ON public.support_orders(status);
CREATE INDEX IF NOT EXISTS idx_support_orders_created_at ON public.support_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_orders_wechat_order_id ON public.support_orders(wechat_order_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_support_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_orders_updated_at 
    BEFORE UPDATE ON public.support_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_support_orders_updated_at();

-- 自动过期订单的定时任务（需要 pg_cron 扩展）
-- 如果没有 pg_cron，可以通过应用层定时任务实现
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('expire-support-orders', '*/5 * * * *', 
--   $$UPDATE support_orders SET status = 'expired' WHERE status = 'pending' AND expires_at < NOW()$$);

-- 添加注释
COMMENT ON TABLE public.support_orders IS '支持订单表，存储用户对项目的支持支付订单';
COMMENT ON COLUMN public.support_orders.id IS '主键，UUID';
COMMENT ON COLUMN public.support_orders.order_no IS '订单号（唯一标识）';
COMMENT ON COLUMN public.support_orders.amount IS '支持金额（1-100）';
COMMENT ON COLUMN public.support_orders.currency IS '货币类型：CNY（人民币）或 USD（美元）';
COMMENT ON COLUMN public.support_orders.wechat_order_id IS '微信支付订单号（transaction_id）';
COMMENT ON COLUMN public.support_orders.qr_code_url IS '微信支付二维码 URL';
COMMENT ON COLUMN public.support_orders.status IS '订单状态：pending（待支付）、paid（已支付）、expired（已过期）、cancelled（已取消）、failed（失败）';
COMMENT ON COLUMN public.support_orders.error_message IS '错误消息（如果订单失败）';
COMMENT ON COLUMN public.support_orders.created_at IS '订单创建时间';
COMMENT ON COLUMN public.support_orders.updated_at IS '订单更新时间';
COMMENT ON COLUMN public.support_orders.expires_at IS '订单过期时间（30分钟后）';
COMMENT ON COLUMN public.support_orders.paid_at IS '支付完成时间';


