// 自然语言搜索关键词映射
// 将用户输入的问题映射到相关的工作流类别、标签或搜索词

export const SEARCH_KEYWORD_MAP: Record<string, string[]> = {
// ==========================================
  // 🤖 AI & LLM (最热门)
  // ==========================================
  'ai': ['openai', 'chatgpt', 'claude', 'gemini', 'llm', 'artificial intelligence', 'langchain'],
  'chatgpt': ['openai', 'chatgpt', 'conversation', 'chatbot'],
  'gpt': ['openai', 'chatgpt', 'text generation'],
  'write': ['openai', 'content', 'blog', 'writer', 'copywriting', 'summary'],
  'summarize': ['openai', 'summary', 'summarization', 'digest', 'meeting notes'],
  'summary': ['openai', 'summary', 'summarization', 'digest'],
  'chatbot': ['chat', 'telegram', 'discord', 'slack', 'openai', 'bot'],
  'agent': ['ai agent', 'autonomous', 'langchain', 'auto-gpt', 'tools'],
  '写文章': ['openai', 'wordpress', 'ghost', 'blog', 'content'],
  '总结': ['openai', 'summary', 'digest', 'meeting'],
  '机器人': ['bot', 'telegram', 'discord', 'wechat', 'slack'],

  // ==========================================
  // 📊 数据处理 & 爬虫 (Price/Data)
  // ==========================================
  'price': ['scraping', 'scraper', 'price', 'monitor', 'tracking', 'html extract'],
  'pricing': ['scraping', 'scraper', 'price', 'monitor'],
  'scrape': ['scraping', 'html', 'extract', 'website', 'crawler', 'puppeteer'],
  'scraping': ['scraping', 'html', 'extract', 'website', 'crawler'],
  'monitor': ['monitoring', 'watch', 'alert', 'price', 'change detection'],
  'excel': ['spreadsheet', 'csv', 'google sheets', 'excel', 'table'],
  'sheets': ['google sheets', 'spreadsheet', 'row', 'column'],
  'csv': ['spreadsheet', 'file', 'parse', 'export'],
  '价格': ['scraping', 'price', 'monitor', 'comparison'],
  '爬虫': ['scraping', 'scraper', 'html', 'puppeteer'],
  '抓取': ['scraping', 'extract', 'fetch'],
  '表格': ['google sheets', 'excel', 'airtable', 'database'],

  // ==========================================
  // 📧 沟通与通知 (Communication)
  // ==========================================
  'email': ['gmail', 'outlook', 'smtp', 'email', 'newsletter', 'marketing'],
  'mail': ['gmail', 'outlook', 'email'],
  'message': ['slack', 'telegram', 'discord', 'whatsapp', 'notification', 'sms'],
  'text': ['sms', 'twilio', 'message', 'notification'],
  'notify': ['notification', 'alert', 'slack', 'telegram', 'email', 'push'],
  'alert': ['notification', 'monitoring', 'incident', 'pagerduty', 'opsgenie'],
  '邮件': ['email', 'gmail', 'outlook', 'smtp'],
  '消息': ['notification', 'telegram', 'wechat', 'slack'],
  '通知': ['notification', 'alert', 'push'],

  // ==========================================
  // 💼 销售与客户 (CRM/Leads)
  // ==========================================
  'client': ['crm', 'hubspot', 'salesforce', 'pipedrive', 'contact', 'lead'],
  'customer': ['crm', 'customer support', 'zendesk', 'intercom', 'lead'],
  'lead': ['lead generation', 'scraping', 'crm', 'enrichment', 'apollo', 'linkedin'],
  'prospect': ['lead', 'linkedin', 'sales', 'outreach'],
  'outreach': ['cold email', 'marketing', 'campaign', 'lemlist'],
  'contact': ['crm', 'google contacts', 'sync'],
  '客户': ['crm', 'lead', 'sales', 'customer'],
  '销售': ['sales', 'crm', 'lead', 'stripe'],
  '线索': ['lead', 'scraping', 'linkedin'],

  // ==========================================
  // 📝 办公与文档 (Productivity)
  // ==========================================
  'notion': ['notion', 'database', 'wiki', 'page', 'sync'],
  'task': ['todoist', 'clickup', 'jira', 'asana', 'task management', 'notion'],
  'todo': ['todoist', 'google tasks', 'microsoft to do', 'task'],
  'calendar': ['google calendar', 'outlook calendar', 'event', 'meeting', 'schedule'],
  'meeting': ['google calendar', 'zoom', 'meeting notes', 'summary', 'recording'],
  'backup': ['google drive', 'dropbox', 'onedrive', 's3', 'archive', 'backup'],
  'file': ['google drive', 's3', 'upload', 'download', 'ftp'],
  'pdf': ['pdf', 'document', 'invoice', 'parse', 'generate'],
  '日程': ['calendar', 'schedule', 'event'],
  '任务': ['task', 'project management', 'jira', 'clickup'],
  '会议': ['meeting', 'zoom', 'calendar', 'summary'],
  '备份': ['backup', 'drive', 'storage'],

  // ==========================================
  // 💰 财务与电商 (Finance/E-com)
  // ==========================================
  'invoice': ['stripe', 'quickbooks', 'xero', 'pdf', 'billing', 'invoice'],
  'payment': ['stripe', 'paypal', 'payment', 'transaction'],
  'order': ['shopify', 'woocommerce', 'order', 'fulfillment', 'shipping'],
  'store': ['shopify', 'woocommerce', 'ecommerce'],
  'crypto': ['binance', 'coinbase', 'crypto', 'bitcoin', 'price', 'web3'],
  'money': ['finance', 'expense', 'budget', 'tracker'],
  '发票': ['invoice', 'pdf', 'finance'],
  '支付': ['payment', 'stripe', 'alipay'],
  '订单': ['order', 'shopify', 'ecommerce'],
  '加密货币': ['crypto', 'bitcoin', 'price'],

  // ==========================================
  // 🎨 社交与内容 (Social/Content)
  // ==========================================
  'social': ['twitter', 'x', 'linkedin', 'facebook', 'instagram', 'buffer'],
  'post': ['social media', 'publishing', 'schedule', 'content'],
  'tweet': ['twitter', 'x', 'social media'],
  'video': ['youtube', 'tiktok', 'transcription', 'video editing', 'ffmpeg'],
  'image': ['openai', 'stable diffusion', 'midjourney', 'image generation', 'cloudinary'],
  'rss': ['rss', 'feed', 'news', 'aggregator'],
  '社交': ['social media', 'twitter', 'linkedin'],
  '发帖': ['posting', 'schedule', 'buffer'],
  '视频': ['youtube', 'video', 'transcription'],
  '图片': ['image', 'openai', 'compression'],

  // ==========================================
  // 🛠️ 开发者与运维 (Dev/Ops)
  // ==========================================
  'api': ['http request', 'webhook', 'api', 'rest', 'graphql'],
  'connect': ['integration', 'webhook', 'sync', 'bridge'],
  'webhook': ['webhook', 'trigger', 'callback', 'listener'],
  'deploy': ['github', 'gitlab', 'ci/cd', 'deployment', 'pipeline'],
  'error': ['error handling', 'monitoring', 'sentry', 'debug', 'alert'],
  'cron': ['schedule', 'timer', 'cron', 'interval', 'trigger'],
  'database': ['postgres', 'mysql', 'supabase', 'mongodb', 'sql'],
  '接口': ['api', 'http', 'webhook'],
  '连接': ['integration', 'sync'],
  '定时': ['cron', 'schedule', 'timer'],
  '数据库': ['database', 'sql', 'supabase'],
  '错误': ['error', 'debug', 'monitor'],
};

/**
 * 将用户输入的自然语言查询转换为搜索关键词
 * @param query 用户输入的查询
 * @returns 扩展后的搜索关键词数组（不包含原始查询）
 */
export function expandSearchQuery(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  // 直接匹配的关键词
  const matchedKeywords: Set<string> = new Set();
  
  // 检查是否有完全匹配的关键词
  if (SEARCH_KEYWORD_MAP[normalizedQuery]) {
    SEARCH_KEYWORD_MAP[normalizedQuery].forEach(k => matchedKeywords.add(k));
  }
  
  // 检查是否包含关键词（部分匹配）
  for (const [key, values] of Object.entries(SEARCH_KEYWORD_MAP)) {
    // 检查查询是否包含关键词，或关键词是否包含查询
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      values.forEach(k => matchedKeywords.add(k));
    }
  }
  
  // 返回去重后的关键词数组（不包含原始查询）
  return Array.from(matchedKeywords);
}
