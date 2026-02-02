import { supabase } from './supabase';
import { unstable_cache } from 'next/cache';

export interface WorkflowData {
  id: string;
  slug: string;
  title: string;
  title_zh?: string;
  summary_short: string;
  summary_short_zh?: string;
  category: string;
  category_zh?: string;
  tags: string[];
  tags_zh?: string[];
  stats: Record<string, unknown>;
  created_at: string;
  author?: string;
  author_id?: string;
  image?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  node_count?: number;
  json_url?: string;
  is_verified?: boolean;
  origin_source?: string;
  aiword_tool_url?: string; // URL to run this workflow on AIWord Cloud
  // Markdown fields
  overview_md?: string;
  overview_md_zh?: string;
  features_md?: string;
  features_md_zh?: string;
  use_cases_md?: string;
  use_cases_md_zh?: string;
  how_to_use_md?: string;
  how_to_use_md_zh?: string;
  // SEO enhancement fields
  faq_data?: Array<{ question: string; answer: string }> | null;
  stats_data?: {
    apps_used?: string[];
    top_nodes?: Record<string, number>;
    complexity?: 'Beginner' | 'Intermediate' | 'Advanced';
    node_count?: number;
  } | null;
  reddit_comments?: Array<{
    body?: string;
    date?: string; // ISO date string
    score?: number;
    author?: string;
    source?: string;
  }> | null;
}

export interface OpalApp {
  id: string;
  slug: string;
  created_at: string;
  
  // 英文核心字段
  title: string;
  description: string | null;
  overview_md: string | null;
  
  // 中文核心字段 (可能为空)
  title_zh: string | null;
  description_zh: string | null;
  overview_md_zh: string | null;
  
  // 元数据
  icon: string | null; // Emoji or URL
  category: string | null;
  tags: string[] | null;
  opal_official_url: string | null;
  is_featured: boolean;
  
  // 核心关联 (UUID 数组)
  related_n8n_workflow_ids: string[] | null;
}

/**
 * Infers metadata like difficulty and node count if missing from the database.
 * This is a temporary solution until the database schema is updated.
 */
/**
 * Calculate node count from workflow JSON URL
 */
export async function calculateNodeCount(jsonUrl: string): Promise<number> {
  try {
    const response = await fetch(jsonUrl, {
      cache: 'force-cache',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workflow JSON');
    }

    const data = await response.json();

    // n8n workflow JSON typically has a 'nodes' array
    if (data && Array.isArray(data.nodes)) {
      return data.nodes.length;
    }

    // Fallback: try other possible structures
    if (data && data.workflow && Array.isArray(data.workflow.nodes)) {
      return data.workflow.nodes.length;
    }

    // If no nodes found, return 0
    return 0;
  } catch (error) {
    console.warn('Failed to calculate node count:', error);
    return 0;
  }
}

export function enrichWorkflowData(workflow: WorkflowData): WorkflowData {
  // Only generate random node count if it's completely missing
  // If it's 0 or a small number, it might be inaccurate data that needs updating
  if (!workflow.node_count || workflow.node_count === 0) {
    // For workflows with json_url, we can potentially calculate real node count
    // For now, use a more conservative estimate
    if (workflow.json_url) {
      // Temporarily set to null to indicate it needs calculation
      // This will be handled by the component that displays it
      workflow.node_count = null as unknown as number;
    } else {
      // Fallback for workflows without JSON
    const idHash = workflow.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    workflow.node_count = 5 + (idHash % 25); // Range 5-30
    }
  }

  // Infer difficulty based on node count
  if (!workflow.difficulty && typeof workflow.node_count === 'number' && workflow.node_count > 0) {
    if (workflow.node_count < 12) {
      workflow.difficulty = 'Beginner';
    } else if (workflow.node_count < 22) {
      workflow.difficulty = 'Intermediate';
    } else {
      workflow.difficulty = 'Advanced';
    }
  }

  return workflow;
}

// Internal function that does the actual query
const _getWorkflowsInternal = async (params: { 
    page: number; 
    limit: number; 
    category?: string[]; 
    sort?: string;
    search?: string;
    language?: 'en' | 'zh';
  }) => {
    const { page, limit, category, sort, search, language } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('workflows')
      .select('*', { count: 'exact' });

    if (category && category.length > 0) {
    // Supabase's .in() is case-sensitive, so we need exact match
    // Filter by category names
      query = query.in('category', category);
    }

    if (search) {
      // Build OR expression to match title, summary and localized fields
      const safe = search.replace(/%/g, '\\%');
      const patterns = [
        `title.ilike.%${safe}%`,
        `summary_short.ilike.%${safe}%`,
        `overview_md.ilike.%${safe}%`,
        `features_md.ilike.%${safe}%`,
        `title_zh.ilike.%${safe}%`,
        `summary_short_zh.ilike.%${safe}%`,
        `overview_md_zh.ilike.%${safe}%`,
        `features_md_zh.ilike.%${safe}%`,
        `slug.ilike.%${safe}%`,
      ];

      // If language specified, prioritize it by putting its fields first
      if (language === 'zh') {
        // move zh fields to front
        patterns.sort((a) => (a.includes('title_zh') || a.includes('summary_short_zh')) ? -1 : 1);
      } else if (language === 'en') {
        patterns.sort((a) => (a.includes('title_zh') || a.includes('summary_short_zh')) ? 1 : -1);
      }

      const orExpr = patterns.join(',');
      query = query.or(orExpr);
    }

  // 根据不同的排序标准排序
  // 注意：难度排序需要在前端进行，因为 node_count 是在 enrichWorkflowData 中计算的
    if (sort === 'Community Verified') {
      // Community Verified: 只显示验证的工作流，按下载量排序
      query = query.eq('is_verified', true).order('stats->downloads', { ascending: false });
    } else if (sort === 'Newest') {
      query = query.order('created_at', { ascending: false });
  } else if (sort === 'Most Downloaded') {
    // Most Downloaded: 根据下载量排序（原 Most Popular）
    query = query.order('stats->downloads', { ascending: false });
  } else if (sort === 'Trending') {
    // Trending: 根据 stats.downloads 排序
    query = query.order('stats->downloads', { ascending: false });
  } else if (sort === 'Hard to Easy' || sort === 'Easy to Hard') {
    // 难度排序：不在数据库层排序，获取数据后在前端排序
    // 暂时按下载量获取数据，后面会重新排序
    query = query.order('stats->downloads', { ascending: false });
  } else {
    // 默认按下载量排序
    query = query.order('stats->downloads', { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching workflows:', error);
    console.error('Query params:', { category, sort, search, from, to });
      return { data: [], count: 0 };
    }

  // Debug: log query results
  if (category && category.length > 0) {
    console.log(`Filtered by categories [${category.join(', ')}]: Found ${count} workflows`);
  }
  // Debug: if search used but returned nothing
  if (search && (!data || (Array.isArray(data) && data.length === 0))) {
    console.debug('Search returned no results', { search, category, sort, from, to });
    }

    const enrichedData = (data as WorkflowData[]).map(enrichWorkflowData);

  // 🔥 前端难度排序：根据 enrichWorkflowData 计算出的 node_count 进行排序
  if (sort === 'Hard to Easy') {
    // Hard to Easy: 节点数从高到低（Advanced → Intermediate → Beginner）
    enrichedData.sort((a, b) => {
      const countA = a.node_count || 0;
      const countB = b.node_count || 0;
      return countB - countA; // 降序
    });
  } else if (sort === 'Easy to Hard') {
    // Easy to Hard: 节点数从低到高（Beginner → Intermediate → Advanced）
    enrichedData.sort((a, b) => {
      const countA = a.node_count || 0;
      const countB = b.node_count || 0;
      return countA - countB; // 升序
    });
  }

    return { data: enrichedData, count: count || 0 };
};

// Public function with proper caching
export const getWorkflows = async (params: { 
  page: number; 
  limit: number; 
  category?: string[]; 
  sort?: string;
  search?: string;
  language?: 'en' | 'zh';
}) => {
  // Generate cache key that includes all parameters
  const cacheKey = [
    'workflows',
    params.page.toString(),
    params.limit.toString(),
    params.category?.sort().join(',') || 'all',
    params.sort || 'default',
    params.search || 'none',
    params.language || 'en',
  ].join('-');

  return unstable_cache(
    () => _getWorkflowsInternal(params),
    [cacheKey],
    { revalidate: 60, tags: ['workflows'] }
  )();
};

/**
 * 获取经过社区验证的工作流（随机化展示，避免 SEO 重复抓取）
 */
export const getVerifiedWorkflows = unstable_cache(
  async (limit: number = 6) => {
    // 🎲 策略：获取更多的认证工作流，然后随机选择
    // 这样每次页面重新生成时，Google 爬到的内容都不同
    const fetchLimit = Math.max(30, limit * 5); // 至少获取 30 个，或者目标数量的 5 倍
    
    // 先尝试按下载量排序
    const result = await supabase
      .from('workflows')
      .select('*')
      .eq('is_verified', true)
      .limit(fetchLimit);

    let data = result.data;
    const error = result.error;

    if (error) {
      console.error('Error fetching verified workflows:', error);
      return [];
    }

    // 如果没有足够的数据，使用更宽松的查询
    if (!data || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('workflows')
        .select('*')
        .eq('is_verified', true)
        .limit(fetchLimit);

      if (fallbackError) {
        console.error('Error fetching verified workflows (fallback):', fallbackError);
        return [];
      }

      data = fallbackData;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // 先 enrich 数据
    const enrichedData = data.map(enrichWorkflowData);

    // 🎲 前端排序：按下载量排序（从 stats 中提取）
    enrichedData.sort((a, b) => {
      const statsA = typeof a.stats === 'string' ? JSON.parse(a.stats) : a.stats;
      const statsB = typeof b.stats === 'string' ? JSON.parse(b.stats) : b.stats;
      const downloadsA = statsA?.downloads || 0;
      const downloadsB = statsB?.downloads || 0;
      return downloadsB - downloadsA;
    });

    // 🎲 随机化逻辑：使用当前小时作为随机种子
    // 这样同一小时内的结果是稳定的（对缓存友好），但每小时都会变化
    const now = new Date();
    const hourSeed = now.getUTCFullYear() * 8760 + now.getUTCMonth() * 730 + now.getUTCDate() * 24 + now.getUTCHours();
    
    // Fisher-Yates 洗牌算法（使用伪随机种子）
    const shuffled = [...enrichedData];
    let random = hourSeed;
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      // 简单的伪随机数生成器（LCG）
      random = (random * 1103515245 + 12345) & 0x7fffffff;
      const j = random % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 取前 N 个
    const selected = shuffled.slice(0, limit);

    return selected;
  },
  ['verified-workflows'],
  { revalidate: 1800, tags: ['workflows'] } // 缓存 30 分钟（配合每小时变化的随机化）
);

export const getCategories = unstable_cache(
  async () => {
    interface CategoryRow {
      name_en?: string | null;
      name_zh?: string | null;
      category?: string | null;
      category_zh?: string | null;
      count?: number | string | null;
    }
    // Normalize category names to stable ids used across the app
    const normalizeCategoryId = (name: string) => {
      return name
        .toLowerCase()
        .normalize('NFKD') // normalize accents
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/[^a-z0-9\s]/g, ' ') // replace non-alphanumeric with space
        .trim()
        .replace(/\s+/g, '-'); // collapse spaces to hyphen
    };
    // Try to run an aggregated query via RPC if available (Postgres function),
    // otherwise fall back to selecting rows and aggregating in JS.
    let rows: CategoryRow[] | null = null;
    // mapping of known category IDs to subtitles (en/zh)
    const CATEGORY_SUBTITLES: Record<string, { en: string; zh: string }> = {
      integration: {
        en: 'System integration and API workflows',
        zh: '系统集成与 API 工作流',
      },
      'content-management': {
        en: 'Content creation and management workflows',
        zh: '内容创建与管理工作流',
      },
      analytics: {
        en: 'Data analytics and reporting workflows',
        zh: '数据分析与报告工作流',
      },
      'data-processing': {
        en: 'Data transformation and processing workflows',
        zh: '数据转换与处理工作流',
      },
      'sales-crm': {
        en: 'Workflows for sales automation and CRM management',
        zh: '销售自动化与 CRM 管理工作流',
      },
      marketing: {
        en: 'Marketing automation and campaign workflows',
        zh: '市场营销自动化与活动管理工作流',
      },
      email: {
        en: 'Email marketing and communication workflows',
        zh: '电子邮件营销与沟通工作流',
      },
      'social-media': {
        en: 'Social media management and automation',
        zh: '社交媒体管理与自动化',
      },
      'e-commerce': {
        en: 'Online store and e-commerce automation',
        zh: '在线商店与电商自动化',
      },
      'project-management': {
        en: 'Project tracking and management automation',
        zh: '项目跟踪与管理自动化',
      },
      finance: {
        en: 'Financial data and accounting automation',
        zh: '财务数据与会计自动化',
      },
      'hr-recruiting': {
        en: 'Human resources and recruitment workflows',
        zh: '人力资源与招聘工作流',
      },
    };

    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('category_counts');
      if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
        rows = rpcData as CategoryRow[];
      }
    } catch {
      // ignore RPC errors and fallback
      rows = null;
    }

    if (!rows) {
      const { data, error } = await supabase
        .from('workflows')
        .select('category, category_zh');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      // Cast returned raw rows to CategoryRow shape
      rows = (data || []).map((r: { category: string | null; category_zh: string | null }) => ({
        category: r.category,
        category_zh: r.category_zh,
      })) as CategoryRow[];
    }

    // If rows came from RPC aggregated results, expect fields: name_en, name_zh, count
    const categoryMap = new Map<string, { name: string; nameZh?: string; count: number }>();
    if (Array.isArray(rows) && rows.length > 0 && rows[0].count !== undefined && (rows[0].name_en || rows[0].category)) {
      // RPC or SQL-like aggregated rows
      rows.forEach((r: CategoryRow) => {
        const name = r.name_en || r.category;
        const nameZh = r.name_zh || r.category_zh;
        const count = Number(r.count || 0);
        if (name) {
          categoryMap.set(name, { name, nameZh: nameZh || undefined, count });
        }
      });
    } else {
      // Fallback: rows are raw workflow rows with category fields, aggregate in JS
      rows.forEach((item: CategoryRow) => {
        const categoryName = item.category;
        if (categoryName) {
          const existing = categoryMap.get(categoryName);
          if (existing) {
            existing.count++;
          } else {
            categoryMap.set(categoryName, {
              name: categoryName,
              nameZh: item.category_zh || undefined,
              count: 1,
            });
          }
        }
      });
    }

    // Build result array with id and subtitles
    const usedIds = new Set<string>();
    const result = Array.from(categoryMap.values()).map(({ name, nameZh, count }) => {
      const idBase = normalizeCategoryId(name);
      let id = idBase;
      // ensure unique id if collisions occur
      let suffix = 1;
      while (usedIds.has(id)) {
        id = `${idBase}-${suffix}`;
        suffix++;
      }
      usedIds.add(id);
      const subtitleEntry = CATEGORY_SUBTITLES[idBase];
      return {
        id,
        name,
        nameZh,
        count,
        subtitle_en: subtitleEntry ? subtitleEntry.en : '',
        subtitle_zh: subtitleEntry ? subtitleEntry.zh : '',
      };
    }).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

    return result;
  },
  ['categories-list'],
  { revalidate: 60, tags: ['categories'] } // Reduce cache time to match workflows cache
);

// 获取每个分类的实际数量（考虑当前排序，但不考虑分类筛选）
// 这样可以显示每个分类在当前排序下的真实数量
export const getCategoryCounts = async (params: {
  sort?: string;
  search?: string;
}) => {
  const { search } = params;

  // 获取所有 workflows（不考虑分类筛选，因为我们要统计每个分类的数量）
  let query = supabase
    .from('workflows')
    .select('category');

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  // 注意：这里不应用排序，因为我们只需要统计数量
  // 排序不会影响每个分类的数量

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }

  const counts: Record<string, number> = {};
  data?.forEach((item) => {
    if (item.category) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
  });

  return counts;
};

export interface CollectionData {
  id: string;
  slug: string;
  title: string;
  title_zh?: string;
  description: string;
  description_zh?: string;
  icon: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  zip_url?: string;
  total_workflows?: number;
  // This will be populated by the JOIN
  collection_items?: Array<{
    workflow_id: string;
    workflows: WorkflowData;
  }>;
  // Computed field for collections list
  workflow_count?: number;
}

// Helper function to retry database operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Only retry on network/connection errors
      if (
        attempt < maxRetries &&
        (errorMessage.includes('terminated') ||
         errorMessage.includes('ECONNRESET') ||
         errorMessage.includes('SocketError') ||
         errorMessage.includes('UND_ERR_SOCKET'))
      ) {
        console.warn(`Retry attempt ${attempt}/${maxRetries} after connection error:`, errorMessage);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        continue;
      }
      
      // Don't retry on other errors
      throw error;
    }
  }
  
  throw lastError;
}

export const getCollections = unstable_cache(
  async () => {
    try {
      const result = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_items (
            workflow_id
          )
        `)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
          throw new Error(JSON.stringify(error));
        }

        return data;
      });

      // Add workflow count to each collection
      const collectionsWithCount = (result as CollectionData[]).map(collection => ({
        ...collection,
        workflow_count: collection.collection_items?.length || 0
      }));

      return collectionsWithCount;
    } catch (ex) {
      // Log the error but return empty array to prevent page crash
      const errorMessage = ex instanceof Error ? ex.message : String(ex);
      console.error('Error fetching collections after retries:', errorMessage);
      return [];
    }
  },
  ['collections-list'],
  { revalidate: 3600, tags: ['collections'] }
);

export const getCollection = unstable_cache(
  async (slug: string, page: number = 1, limit: number = 20) => {
    // First get the collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single();

    if (collectionError || !collection) {
      return null;
    }

    // Get collection items
    const { data: itemsData, error: itemsError } = await supabase
      .from('collection_items')
      .select('workflow_id')
      .eq('collection_id', collection.id);

    if (itemsError || !itemsData || itemsData.length === 0) {
      console.log('No collection items found:', { itemsError, count: itemsData?.length });
      return {
        ...collection,
        collection_items: [],
        total_workflows: 0,
        current_page: page,
        total_pages: 0
      } as CollectionData & { total_workflows: number; current_page: number; total_pages: number };
    }

    const totalWorkflows = itemsData.length;
    const totalPages = Math.ceil(totalWorkflows / limit);
    const offset = (page - 1) * limit;

    // Paginate workflow IDs
    const paginatedWorkflowIds = itemsData
      .slice(offset, offset + limit)
      .map(item => item.workflow_id);

    // Get workflows data separately (only for current page)
    const { data: workflowsData, error: workflowsError } = await supabase
      .from('workflows')
      .select(`
        id,
        slug,
        title,
        title_zh,
        summary_short,
        summary_short_zh,
        category,
        category_zh,
        tags,
        tags_zh,
        created_at,
        json_url,
        stats
      `)
      .in('id', paginatedWorkflowIds);

    console.log('Separate queries result:', {
      collectionId: collection.id,
      itemsCount: itemsData.length,
      paginatedWorkflowIds,
      workflowsError,
      workflowsCount: workflowsData?.length || 0,
      workflowsData: workflowsData?.slice(0, 1) // Show first workflow
    });

    // Combine the data
    const enrichedItems = itemsData.map((item: { workflow_id: string }) => {
      const workflow = workflowsData?.find((w: WorkflowData) => w.id === item.workflow_id);
      return {
        workflow_id: item.workflow_id,
        workflows: workflow ? enrichWorkflowData(workflow) : null
      };
    });

    return {
      ...collection,
      collection_items: enrichedItems,
      total_workflows: totalWorkflows,
      current_page: page,
      total_pages: totalPages
    } as CollectionData & { total_workflows: number; current_page: number; total_pages: number };
  },
  ['collection-detail'],
  { revalidate: 3600, tags: ['collections'] }
);

export const getWorkflow = unstable_cache(
  async (slug: string) => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return null;
    }

    return enrichWorkflowData(data as WorkflowData);
  },
  ['workflow-detail'],
  { revalidate: 3600, tags: ['workflows'] }
);

// 计算协同过滤得分（基于用户行为相似度）
function calculateCollaborativeScore(workflow: WorkflowData, currentWorkflow: WorkflowData): number {
  const currentStats = typeof currentWorkflow.stats === 'string' ? JSON.parse(currentWorkflow.stats) : currentWorkflow.stats;
  const workflowStats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
  
  const currentPopularity = (currentStats?.views || 0) + (currentStats?.downloads || 0);
  const workflowPopularity = (workflowStats?.views || 0) + (workflowStats?.downloads || 0);
  
  // 如果两个工作流的受欢迎程度相近，说明用户群体可能相似
  const popularityDiff = Math.abs(currentPopularity - workflowPopularity);
  const maxPopularity = Math.max(currentPopularity, workflowPopularity, 1);
  const similarityScore = 1 - (popularityDiff / maxPopularity);
  
  return similarityScore;
}

// 计算综合推荐得分
function calculateRecommendationScore(
  workflow: WorkflowData, 
  currentWorkflow: WorkflowData, 
  currentTags: string[]
): number {
  let score = 0;
  
  // 1. 分类匹配 (40分)
  if (workflow.category === currentWorkflow.category) {
    score += 40;
  }
  
  // 2. 标签相似度 (30分)
  const workflowTags = workflow.tags || [];
  const commonTags = workflowTags.filter(tag => currentTags.includes(tag)).length;
  const maxTags = Math.max(currentTags.length, workflowTags.length, 1);
  score += (commonTags / maxTags) * 30;
  
  // 3. 协同过滤得分 (20分)
  const collaborativeScore = calculateCollaborativeScore(workflow, currentWorkflow);
  score += collaborativeScore * 20;
  
  // 4. 受欢迎程度 (10分) - 归一化
  const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
  const popularity = (stats?.views || 0) + (stats?.downloads || 0);
  const normalizedPopularity = Math.min(popularity / 1000, 1); // 假设1000为高人气阈值
  score += normalizedPopularity * 10;
  
  return score;
}

// 获取推荐工作流（增强版：协同过滤 + 确保返回足够数量）
const _getRelatedWorkflowsInternal = async (currentWorkflowId: string, category: string | null, tags: string[] | null, limit: number) => {
  const currentTags = tags || [];
  
  // 策略1: 优先获取相同分类的工作流（获取更多用于筛选）
  let candidateWorkflows: WorkflowData[] = [];
  
  if (category) {
    const { data: categoryData } = await supabase
      .from('workflows')
      .select('*')
      .eq('category', category)
      .neq('id', currentWorkflowId)
      .limit(50); // 获取足够多的候选
    
    if (categoryData && categoryData.length > 0) {
      candidateWorkflows = categoryData as WorkflowData[];
    }
  }
  
  // 策略2: 如果相同分类的不够，添加其他分类的工作流
  if (candidateWorkflows.length < limit * 2) {
    const { data: otherData } = await supabase
    .from('workflows')
    .select('*')
    .neq('id', currentWorkflowId)
      .limit(50);
    
    if (otherData) {
      // 合并并去重
      const existingIds = new Set(candidateWorkflows.map(w => w.id));
      const additionalWorkflows = (otherData as WorkflowData[]).filter(w => !existingIds.has(w.id));
      candidateWorkflows = [...candidateWorkflows, ...additionalWorkflows];
    }
  }
  
  // 如果还是没有足够的候选，直接返回空数组（这种情况极少发生）
  if (candidateWorkflows.length === 0) {
    console.warn('No candidate workflows found for recommendations');
    return [];
  }

  // 获取当前工作流的完整数据（用于协同过滤）
  const { data: currentWorkflowData } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', currentWorkflowId)
    .single();
  
  const currentWorkflow = currentWorkflowData as WorkflowData;
  
  // 为每个候选工作流计算推荐得分
  const scoredWorkflows = candidateWorkflows.map(workflow => ({
    workflow: enrichWorkflowData(workflow),
    score: calculateRecommendationScore(workflow, currentWorkflow, currentTags)
  }));
  
  // 按得分排序
  scoredWorkflows.sort((a, b) => b.score - a.score);
  
  // 提取排序后的工作流
  let recommendedWorkflows = scoredWorkflows.map(item => item.workflow);
  
  // 策略3: 确保返回足够数量 - 如果推荐结果不足，随机补充同类别工作流
  if (recommendedWorkflows.length < limit && category) {
    const neededCount = limit - recommendedWorkflows.length;
    const existingIds = new Set(recommendedWorkflows.map(w => w.id));
    existingIds.add(currentWorkflowId);
    
    // 获取更多同类别工作流用于随机补充
    const { data: randomData } = await supabase
      .from('workflows')
      .select('*')
      .eq('category', category)
      .neq('id', currentWorkflowId)
      .limit(50);
    
    if (randomData && randomData.length > 0) {
      const availableWorkflows = (randomData as WorkflowData[])
        .filter(w => !existingIds.has(w.id))
        .map(enrichWorkflowData);
      
      // 随机打乱
      const shuffled = availableWorkflows.sort(() => Math.random() - 0.5);
      
      // 补充到所需数量
      recommendedWorkflows = [
        ...recommendedWorkflows,
        ...shuffled.slice(0, neededCount)
      ];
    }
  }

  // 策略4: 如果还是不够（没有同类别的），从全局随机补充
  if (recommendedWorkflows.length < limit) {
    const neededCount = limit - recommendedWorkflows.length;
    const existingIds = new Set(recommendedWorkflows.map(w => w.id));
    existingIds.add(currentWorkflowId);
    
    const { data: globalRandomData } = await supabase
      .from('workflows')
      .select('*')
      .neq('id', currentWorkflowId)
      .limit(50);
    
    if (globalRandomData && globalRandomData.length > 0) {
      const availableWorkflows = (globalRandomData as WorkflowData[])
        .filter(w => !existingIds.has(w.id))
        .map(enrichWorkflowData);
      
      // 随机打乱
      const shuffled = availableWorkflows.sort(() => Math.random() - 0.5);
      
      // 补充到所需数量
      recommendedWorkflows = [
        ...recommendedWorkflows,
        ...shuffled.slice(0, neededCount)
      ];
    }
  }
  
  // 确保返回精确的数量（如果有的话）
  return recommendedWorkflows.slice(0, limit);
};

export const getRelatedWorkflows = async (currentWorkflow: WorkflowData, limit: number = 6) => {
  const cacheKey = [
    'related-workflows',
    currentWorkflow.id,
    currentWorkflow.category || 'no-category',
    (currentWorkflow.tags || []).sort().join(',') || 'no-tags',
    limit.toString(),
  ].join('-');

  return unstable_cache(
    () => _getRelatedWorkflowsInternal(
      currentWorkflow.id,
      currentWorkflow.category || null,
      currentWorkflow.tags || null,
      limit
    ),
    [cacheKey],
    { revalidate: 3600, tags: ['workflows'] }
  )();
};

/**
 * Get integration pair by slug
 */
export async function getIntegrationPair(slug: string) {
  try {
    console.log(`getIntegrationPair: Fetching integration pair for slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('integration_pairs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching integration pair:', error);
      console.error('Error details:', JSON.stringify(error));
      return null;
    }

    console.log('getIntegrationPair: Found integration pair:', {
      slug: data?.slug,
      app_a: data?.app_a,
      app_b: data?.app_b,
      count: data?.count,
      workflow_ids_type: typeof data?.workflow_ids,
      workflow_ids_length: Array.isArray(data?.workflow_ids) ? data.workflow_ids.length : 'not an array',
    });

    return data;
  } catch (error) {
    console.error('Error in getIntegrationPair:', error);
    return null;
  }
}

/**
 * Get all integration pairs for directory page
 * Returns all pairs sorted by app_a alphabetically, then by count
 */
export const getAllIntegrationPairs = unstable_cache(
  async () => {
    try {
      const pageSize = 1000;
      let offset = 0;
      const allPairs: Array<{ slug: string; app_a: string; app_b: string; count: number }> = [];

      console.log('🔍 getAllIntegrationPairs: 开始抓取所有集成组合数据...');

      // 首先获取总数
      const { count: totalCount, error: countError } = await supabase
        .from('integration_pairs')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('❌ Error getting integration pairs count:', countError.message);
      } else {
        console.log(`📊 数据库中共有 ${totalCount || 0} 个集成组合`);
      }

      // 分页获取所有数据（包括 count = 0 的记录）
      while (true) {
        const { data, error } = await supabase
          .from('integration_pairs')
          .select('slug, app_a, app_b, count')
          .order('app_a', { ascending: true })
          .order('count', { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (error) {
          console.error('❌ Error fetching integration pairs:', error);
          break;
        }

        if (!data || data.length === 0) {
          break;
        }

        allPairs.push(...data);
        console.log(`✅ 已获取 ${allPairs.length} 条集成组合数据 (当前页: ${data.length}, offset: ${offset})`);

        if (data.length < pageSize) break;
        offset += pageSize;
      }

      console.log(`🎯 最终获取 ${allPairs.length} 个集成组合${totalCount ? ` (数据库总数: ${totalCount})` : ''}`);

      // Remove duplicates based on slug (keep the one with highest count if duplicates exist)
      const uniquePairsMap = new Map<string, { slug: string; app_a: string; app_b: string; count: number }>();
      allPairs.forEach(pair => {
        const existing = uniquePairsMap.get(pair.slug);
        if (!existing || pair.count > existing.count) {
          uniquePairsMap.set(pair.slug, pair);
        }
      });
      const uniquePairs = Array.from(uniquePairsMap.values());
      
      if (uniquePairs.length < allPairs.length) {
        console.log(`⚠️  发现 ${allPairs.length - uniquePairs.length} 个重复的集成组合，已去重`);
      }

      // Sort by app_a alphabetically, then by count (descending)
      const sorted = uniquePairs.sort((a, b) => {
        const appACompare = a.app_a.localeCompare(b.app_a, 'en', { sensitivity: 'base' });
        if (appACompare !== 0) {
          return appACompare;
        }
        // If app_a is the same, sort by count descending
        return b.count - a.count;
      });

      console.log(`✅ 去重后返回 ${sorted.length} 个唯一的集成组合`);
      return sorted;
    } catch (error) {
      console.error('Error in getAllIntegrationPairs:', error);
      return [];
    }
  },
  ['all-integration-pairs'],
  { revalidate: 86400, tags: ['integration_pairs'] }
);

/**
 * Get all integration pairs for directory page
 * Returns top 100 by count (most popular)
 * @deprecated Use getAllIntegrationPairs for full directory page
 */
export async function getIntegrationPairs(limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('integration_pairs')
      .select('slug, app_a, app_b, count')
      .order('count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching integration pairs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getIntegrationPairs:', error);
    return [];
  }
}

/**
 * Get workflows by IDs for integration pair
 */
export async function getWorkflowsByIds(workflowIds: string[]) {
  if (!workflowIds || workflowIds.length === 0) {
    console.log('getWorkflowsByIds: No workflow IDs provided');
    return [];
  }

  try {
    console.log(`getWorkflowsByIds: Fetching ${workflowIds.length} workflows:`, workflowIds);
    
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .in('id', workflowIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workflows by IDs:', error);
      console.error('Error details:', JSON.stringify(error));
      return [];
    }

    console.log(`getWorkflowsByIds: Found ${data?.length || 0} workflows`);

    // Enrich workflow data
    const enrichedWorkflows = (data || []).map(enrichWorkflowData);
    
    return enrichedWorkflows;
  } catch (error) {
    console.error('Error in getWorkflowsByIds:', error);
    return [];
  }
}

/**
 * Extract potential app names from workflow title and tags
 * This is a simplified approach - extracts common app names from text
 */
function extractAppNames(workflow: WorkflowData): string[] {
  const appNames: Set<string> = new Set();
  
  // Common app names to look for (lowercase for matching)
  const commonApps = [
    'notion', 'slack', 'discord', 'github', 'gitlab', 'google', 'gmail', 'sheets', 'drive',
    'airtable', 'trello', 'asana', 'clickup', 'monday', 'jira', 'confluence',
    'shopify', 'woocommerce', 'stripe', 'paypal', 'mailchimp', 'sendgrid',
    'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok',
    'zapier', 'make', 'ifttt', 'hubspot', 'salesforce', 'pipedrive',
    'dropbox', 'onedrive', 'box', 'aws', 'azure', 'gcp',
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    'wordpress', 'webflow', 'squarespace', 'wix'
  ];
  
  // Extract from title (case-insensitive)
  const titleText = `${workflow.title} ${workflow.title_zh || ''}`.toLowerCase();
  commonApps.forEach(app => {
    if (titleText.includes(app)) {
      appNames.add(app);
    }
  });
  
  // Extract from tags
  const allTags = [...(workflow.tags || []), ...(workflow.tags_zh || [])];
  allTags.forEach(tag => {
    const tagLower = tag.toLowerCase();
    commonApps.forEach(app => {
      if (tagLower.includes(app) || app.includes(tagLower)) {
        appNames.add(app);
      }
    });
    // Also add tag itself if it looks like an app name
    if (tagLower.length > 2 && tagLower.length < 20) {
      appNames.add(tagLower);
    }
  });
  
  return Array.from(appNames);
}

/**
 * Internal function to fetch related integrations
 */
async function _getRelatedIntegrationsInternal(workflow: WorkflowData, limit: number = 10) {
  try {
    const appNames = extractAppNames(workflow);
    
    if (appNames.length === 0) {
      return [];
    }
    
    // Build OR query: app_a or app_b contains any of the app names
    const conditions: string[] = [];
    appNames.forEach(app => {
      const appLower = app.toLowerCase();
      conditions.push(`app_a.ilike.%${appLower}%`);
      conditions.push(`app_b.ilike.%${appLower}%`);
    });
    
    const orExpr = conditions.join(',');
    
    const { data, error } = await supabase
      .from('integration_pairs')
      .select('slug, app_a, app_b, count')
      .or(orExpr)
      .gt('count', 0)
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching related integrations:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRelatedIntegrations:', error);
    return [];
  }
}

/**
 * Get related integrations for a workflow
 * Searches integration_pairs table for combinations that include apps mentioned in the workflow
 */
export const getRelatedIntegrations = async (workflow: WorkflowData, limit: number = 10) => {
  const cacheKey = [
    'related-integrations',
    workflow.id,
    workflow.slug,
    (workflow.tags || []).sort().join(','),
    limit.toString(),
  ].join('-');

  return unstable_cache(
    () => _getRelatedIntegrationsInternal(workflow, limit),
    [cacheKey],
    { revalidate: 3600, tags: ['integration_pairs'] }
  )();
};

/**
 * Get Opal App by slug
 */
export const getOpalApp = unstable_cache(
  async (slug: string): Promise<OpalApp | null> => {
    try {
      const { data, error } = await supabase
        .from('opal_apps')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching Opal app:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          slug,
          fullError: JSON.stringify(error, null, 2)
        });
        // If table doesn't exist, return null gracefully
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('opal_apps table does not exist yet.');
          return null;
        }
        return null;
      }

      if (!data) {
        return null;
      }

      // Safely parse related_n8n_workflow_ids and tags
      let parsedWorkflowIds = null;
      let parsedTags = null;

      try {
        if (data.related_n8n_workflow_ids) {
          if (Array.isArray(data.related_n8n_workflow_ids)) {
            parsedWorkflowIds = data.related_n8n_workflow_ids;
          } else if (typeof data.related_n8n_workflow_ids === 'string') {
            parsedWorkflowIds = JSON.parse(data.related_n8n_workflow_ids);
          }
        }
      } catch (e) {
        console.warn('Failed to parse related_n8n_workflow_ids for app:', data.id, e);
      }

      try {
        if (data.tags) {
          if (Array.isArray(data.tags)) {
            parsedTags = data.tags;
          } else if (typeof data.tags === 'string') {
            parsedTags = JSON.parse(data.tags);
          }
        }
      } catch (e) {
        console.warn('Failed to parse tags for app:', data.id, e);
      }

      return {
        ...data,
        related_n8n_workflow_ids: parsedWorkflowIds,
        tags: parsedTags,
      } as OpalApp;
    } catch (err) {
      console.error('Unexpected error in getOpalApp:', err);
      return null;
    }
  },
  ['opal-app-detail'],
  { revalidate: 300, tags: ['opal_apps'] }
);

/**
 * Get all Opal Apps
 */
export const getAllOpalApps = unstable_cache(
  async (): Promise<OpalApp[]> => {
    try {
      const { data, error } = await supabase
        .from('opal_apps')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching Opal apps:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: JSON.stringify(error, null, 2)
        });
        // If table doesn't exist, return empty array gracefully
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('opal_apps table does not exist yet. Returning empty array.');
          return [];
        }
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Parse related_n8n_workflow_ids and tags for each app
      return data.map((app) => {
        let parsedWorkflowIds = null;
        let parsedTags = null;

        // Safely parse related_n8n_workflow_ids
        try {
          if (app.related_n8n_workflow_ids) {
            if (Array.isArray(app.related_n8n_workflow_ids)) {
              parsedWorkflowIds = app.related_n8n_workflow_ids;
            } else if (typeof app.related_n8n_workflow_ids === 'string') {
              parsedWorkflowIds = JSON.parse(app.related_n8n_workflow_ids);
            }
          }
        } catch (e) {
          console.warn('Failed to parse related_n8n_workflow_ids for app:', app.id, e);
        }

        // Safely parse tags
        try {
          if (app.tags) {
            if (Array.isArray(app.tags)) {
              parsedTags = app.tags;
            } else if (typeof app.tags === 'string') {
              parsedTags = JSON.parse(app.tags);
            }
          }
        } catch (e) {
          console.warn('Failed to parse tags for app:', app.id, e);
        }

        return {
          ...app,
          related_n8n_workflow_ids: parsedWorkflowIds,
          tags: parsedTags,
        } as OpalApp;
      });
    } catch (err) {
      console.error('Unexpected error in getAllOpalApps:', err);
      return [];
    }
  },
  ['all-opal-apps'],
  { revalidate: 300, tags: ['opal_apps'] }
);
