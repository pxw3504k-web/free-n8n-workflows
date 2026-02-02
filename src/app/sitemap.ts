import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// 1. 初始化客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. 修正类型定义：去掉 updated_at，改为 created_at
type WorkflowRow = {
  slug: string;
  created_at: string | null;
};

type CollectionRow = {
  slug: string;
  created_at: string;
};

type IntegrationPairRow = {
  slug: string;
  updated_at: string | null;
  count: number;
};

type OpalAppRow = {
  slug: string;
  created_at: string | null;
};

async function fetchAllWorkflows() : Promise<WorkflowRow[]> {
  const pageSize = 1000;
  let offset = 0;
  const allWorkflows: WorkflowRow[] = [];

  console.log('🔍 Sitemap: 开始抓取工作流数据...');

  // 首先获取总数
  const { count: totalCount, error: countError } = await supabase
    .from('workflows')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Supabase Error getting count:', countError.message);
  } else {
    console.log(`📊 数据库中共有 ${totalCount || 0} 个工作流`);
  }

  while (true) {
    // 添加排序以确保分页查询的正确性
    const { data, error } = await supabase
      .from('workflows')
      .select('slug, created_at')
      .order('created_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('❌ Supabase Error:', error.message);
      break;
    }

    if (!data || data.length === 0) {
      break;
    }

    allWorkflows.push(...(data as WorkflowRow[]));
    console.log(`✅ 已获取 ${allWorkflows.length} 条工作流数据 (当前页: ${data.length}, offset: ${offset})`);

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  console.log(`🎯 最终获取 ${allWorkflows.length} 个工作流${totalCount ? ` (数据库总数: ${totalCount})` : ''}`);
  return allWorkflows;
}

async function fetchAllCollections() : Promise<CollectionRow[]> {
  // 首先获取总数
  const { count: totalCount, error: countError } = await supabase
    .from('collections')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Supabase Error getting collections count:', countError.message);
  } else {
    console.log(`📊 数据库中共有 ${totalCount || 0} 个合集`);
  }

  const { data, error } = await supabase
    .from('collections')
    .select('slug, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase Error fetching collections:', error.message);
    return [];
  }

  console.log(`✅ 已获取 ${data?.length || 0} 条合集数据${totalCount ? ` (数据库总数: ${totalCount})` : ''}`);
  return (data as CollectionRow[]) || [];
}

async function fetchAllIntegrationPairs() : Promise<IntegrationPairRow[]> {
  const pageSize = 1000;
  let offset = 0;
  const allPairs: IntegrationPairRow[] = [];

  console.log('🔍 Sitemap: 开始抓取集成组合数据...');

  // 首先获取总数（包括所有记录，不限制 count）
  const { count: totalCount, error: countError } = await supabase
    .from('integration_pairs')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Supabase Error getting integration pairs count:', countError.message);
  } else {
    console.log(`📊 数据库中共有 ${totalCount || 0} 个集成组合（全部记录）`);
  }

  // 获取所有记录，不限制 count（包括 count = 0 的记录）
  while (true) {
    const { data, error } = await supabase
      .from('integration_pairs')
      .select('slug, updated_at, count')
      .order('app_a', { ascending: true })
      .order('count', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('❌ Supabase Error fetching integration pairs:', error.message);
      break;
    }

    if (!data || data.length === 0) {
      break;
    }

    allPairs.push(...(data as IntegrationPairRow[]));
    console.log(`✅ 已获取 ${allPairs.length} 条集成组合数据 (当前页: ${data.length}, offset: ${offset})`);

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  console.log(`🎯 最终获取 ${allPairs.length} 个集成组合${totalCount ? ` (数据库总数: ${totalCount})` : ''}`);
  return allPairs;
}

async function fetchAllOpalApps(): Promise<OpalAppRow[]> {
  // 首先获取总数
  const { count: totalCount, error: countError } = await supabase
    .from('opal_apps')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Supabase Error getting opal apps count:', countError.message);
  } else {
    console.log(`📊 数据库中共有 ${totalCount || 0} 个 Opal 应用`);
  }

  const { data, error } = await supabase
    .from('opal_apps')
    .select('slug, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase Error fetching opal apps:', error.message);
    // If table doesn't exist, return empty array gracefully
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      console.warn('opal_apps table does not exist yet. Returning empty array.');
      return [];
    }
    return [];
  }

  console.log(`✅ 已获取 ${data?.length || 0} 条 Opal 应用数据${totalCount ? ` (数据库总数: ${totalCount})` : ''}`);
  return (data as OpalAppRow[]) || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world').replace(/\/$/, '');

  const [workflows, collections, integrationPairs, opalApps] = await Promise.all([
    fetchAllWorkflows(),
    fetchAllCollections(),
    fetchAllIntegrationPairs(),
    fetchAllOpalApps()
  ]);

  const workflowRoutes: MetadataRoute.Sitemap = workflows.map((item) => ({
    url: `${baseUrl}/workflow/${item.slug}`,
    // 4. 修正时间逻辑：只使用 created_at
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((item) => ({
    url: `${baseUrl}/collection/${item.slug}`,
    lastModified: new Date(item.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const integrationRoutes: MetadataRoute.Sitemap = integrationPairs.map((item) => ({
    url: `${baseUrl}/integration/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const opalAppRoutes: MetadataRoute.Sitemap = opalApps.map((item) => ({
    url: `${baseUrl}/googleopal/${item.slug}`,
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/categories',
    '/authors',
    '/leaderboard',
    '/submit',
    '/collections',
    '/custom-workflow',
    '/search',
    '/support',
    '/privacy',
    '/terms',
    '/integration', // 集成目录页
    '/googleopal', // Google Opal 目录页
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/integration' || route === '/googleopal' || route === '/leaderboard' ? 'daily' : 'weekly',
    priority: route === '' 
      ? 1 
      : route === '/integration' || route === '/googleopal' || route === '/leaderboard'
      ? 0.9 
      : 0.8,
  }));

  const totalCount = staticRoutes.length + workflowRoutes.length + collectionRoutes.length + integrationRoutes.length + opalAppRoutes.length;
  
  console.log(`🎉 Sitemap 生成完毕:`);
  console.log(`   📄 静态页面: ${staticRoutes.length}`);
  console.log(`   🔧 工作流: ${workflowRoutes.length}`);
  console.log(`   📚 合集: ${collectionRoutes.length}`);
  console.log(`   🔗 集成组合: ${integrationRoutes.length}`);
  console.log(`   ⚡ Opal 应用: ${opalAppRoutes.length}`);
  console.log(`   📊 总计: ${totalCount}`);
  
  // 检查是否超过 sitemap 限制 (50,000 URLs)
  if (totalCount > 50000) {
    console.warn(`⚠️  警告: Sitemap 包含 ${totalCount} 个 URL，超过 50,000 限制。建议实现 sitemap 索引。`);
  }

  return [...staticRoutes, ...workflowRoutes, ...collectionRoutes, ...integrationRoutes, ...opalAppRoutes];
}