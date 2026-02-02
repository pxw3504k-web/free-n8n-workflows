import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkflowCard } from '@/components/WorkflowCard';
import { PERSONA_CONFIG } from '@/lib/personaConfig';
import { supabase } from '@/lib/supabase';
import { enrichWorkflowData, WorkflowData } from '@/lib/data';

interface PageProps {
  params: Promise<{ role: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const config = PERSONA_CONFIG[role as keyof typeof PERSONA_CONFIG];
  
  if (!config) {
    return {
      title: 'Role Not Found | N8N Workflows',
      description: 'The role you are looking for could not be found.',
    };
  }

  const currentYear = new Date().getFullYear();
  const resolvedSearchParams = (await searchParams) || {};
  const lang = (typeof resolvedSearchParams?.lang === 'string' ? resolvedSearchParams.lang : (Array.isArray(resolvedSearchParams?.lang) ? resolvedSearchParams?.lang[0] : 'en')) || 'en';
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
  const pageUrl = `${siteUrl.replace(/\/$/, '')}/for/${role}`;
  
  // Build OG image URL
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og?title=${encodeURIComponent(config.title)}&nodes=${encodeURIComponent(config.searchQuery)}`;
  
  // SEO optimized title
  const seoTitle = `${config.title} - Free n8n Workflows ${currentYear} | N8N Templates`;
  
  // SEO optimized description
  const seoDescription = `⚡ ${config.description} Download free n8n automation templates tailored for ${role}. Copy-paste ready JSON. No coding required. Start automating in minutes.`;
  
  // Keywords
  const keywords: string[] = [
    config.title,
    `n8n workflows for ${role}`,
    `automation for ${role}`,
    'free n8n workflow',
    'n8n template',
    'n8n automation',
    config.searchQuery,
    'no-code automation',
    'workflow automation',
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    
    openGraph: {
      title: `🚀 ${config.title} - Free n8n Workflows`,
      description: seoDescription,
      type: 'website',
      url: pageUrl,
      siteName: 'N8N Workflows',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${config.title} - n8n Workflows`,
        },
      ],
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `⚡ ${config.title}`,
      description: seoDescription.slice(0, 200),
      images: [ogImageUrl],
    },
    
    alternates: {
      canonical: pageUrl,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PersonaPage({ params }: PageProps) {
  const { role } = await params;
  
  // 查找对应的配置
  const config = PERSONA_CONFIG[role as keyof typeof PERSONA_CONFIG];
  
  if (!config) {
    notFound();
  }

  // 查询工作流：title 包含 searchQuery 或 tags 包含 searchQuery
  const searchQuery = config.searchQuery;
  
  // 构建 OR 查询条件
  // 对于 tags 数组字段，使用 cs (contains) 操作符检查数组是否包含 searchQuery
  // 转义特殊字符以避免 SQL 注入
  const safeQuery = searchQuery.replace(/%/g, '\\%');
  
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .or(`title.ilike.%${safeQuery}%,tags.cs.{${searchQuery}}`)
    .limit(12);

  if (error) {
    console.error('Error fetching workflows:', error);
  }

  // 处理数据并丰富工作流信息
  const enrichedWorkflows: WorkflowData[] = (workflows || [])
    .map(workflow => enrichWorkflowData(workflow as WorkflowData));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* 页面标题和描述 */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-gray-100 mb-4">
              {config.title}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>

          {/* 工作流列表 */}
          {enrichedWorkflows.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrichedWorkflows.map((workflow, index) => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                  Coming Soon
                </h2>
                <p className="text-gray-400">
                  We're working on adding more workflows for {config.title.toLowerCase()}. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
