# 微信支付配置说明

## 环境变量配置

在 `.env.local` 文件中添加以下配置：

```env
# 微信支付配置
WECHAT_APP_ID=wxbce3a3f8b107fbff
WECHAT_MCH_ID=1720449271
WECHAT_API_KEY=7Gp9qK2RvXmLbY4ZtA1wQc8NsD3fasqw
WECHAT_NOTIFY_URL=https://your-domain.com/api/support/wechat/callback
```

## 微信商户平台配置

### 1. 配置支付回调

1. 登录微信商户平台
2. 进入"产品中心 -> 开发配置 -> 支付回调"
3. 添加回调地址：`https://your-domain.com/api/support/wechat/callback`
4. 保存配置

### 2. 配置 IP 白名单

1. 进入"账户中心 -> API安全 -> IP白名单"
2. 添加服务器 IP 地址
3. 保存配置

## 数据库表结构

执行 `database_schema_support.sql` 文件创建支持订单表。

## 测试

1. 使用微信支付沙箱环境进行测试
2. 确保回调地址可访问（必须是 HTTPS）
3. 测试支付流程和回调处理


