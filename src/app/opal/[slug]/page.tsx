import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkflowCard } from '@/components/WorkflowCard';
import { OpalCard } from '@/components/opal/OpalCard';
import { getOpalApp, getWorkflowsByIds, getAllOpalApps, WorkflowData, OpalApp } from '@/lib/data';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, BookOpen, Globe, Zap } from 'lucide-react';
import { OpalShareButton } from '@/components/opal/OpalShareButton';
import { OpalLanguageSync } from '@/components/opal/OpalLanguageSync';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const lang = (typeof resolvedSearchParams?.lang === 'string' ? resolvedSearchParams.lang : (Array.isArray(resolvedSearchParams?.lang) ? resolvedSearchParams?.lang[0] : 'en')) || 'en';
  
  const app = await getOpalApp(slug);

  if (!app) {
    return {
      title: 'Opal App Not Found | N8N Workflows',
      description: 'The Opal app you are looking for could not be found.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const year = new Date().getFullYear();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
  
  // Title 策略
  const appTitle = lang === 'zh' ? (app.title_zh || app.title) : app.title;
  const seoTitle = lang === 'zh' 
    ? `${appTitle} - 免费 Google Opal 模版 ${year} | N8N Workflows`
    : `${appTitle} - Free Google Opal Template ${year} | N8N Workflows`;
  
  // Description 策略
  const shortDesc = lang === 'zh' 
    ? (app.description_zh || app.description || '')
    : (app.description || '');
  const seoDescription = lang === 'zh'
    ? `⚡ ${shortDesc} 免费试用这个 AI 小程序。无需编程。使用 n8n 构建专业版。`
    : `⚡ ${shortDesc} Try this AI mini-app for free. No coding required. Build the Pro version with n8n.`;

  // Keywords
  const keywords = [
    app.title,
    app.title_zh,
    app.category,
    'google opal template',
    'ai app',
    'n8n alternative',
    'free opal app',
    'opal mini-app',
    `${app.title} opal`,
    `google opal ${app.title}`,
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);

  // OG Image URL
  const iconParam = app.icon ? encodeURIComponent(app.icon) : '';
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og/opal?title=${encodeURIComponent(appTitle)}&icon=${iconParam}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      url: `${siteUrl.replace(/\/$/, '')}/opal/${slug}`,
      siteName: 'N8N Workflows',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${appTitle} - Google Opal Template`,
        },
      ],
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteUrl.replace(/\/$/, '')}/opal/${slug}`,
      languages: {
        'en-US': `${siteUrl.replace(/\/$/, '')}/opal/${slug}`,
        'zh-CN': `${siteUrl.replace(/\/$/, '')}/opal/${slug}?lang=zh`,
      },
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


// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export default async function OpalAppPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const lang = (typeof resolvedSearchParams?.lang === 'string' ? resolvedSearchParams.lang : (Array.isArray(resolvedSearchParams?.lang) ? resolvedSearchParams?.lang[0] : 'en')) || 'en';
  
  const app = await getOpalApp(slug);

  if (!app) {
    notFound();
  }

  // 并行查询关联的 workflows 和同分类的其他应用
  let relatedWorkflows: WorkflowData[] = [];
  if (app.related_n8n_workflow_ids && app.related_n8n_workflow_ids.length > 0) {
    relatedWorkflows = await getWorkflowsByIds(app.related_n8n_workflow_ids);
  }

  // 获取同分类的其他应用（用于底部推荐）
  let relatedApps: OpalApp[] = [];
  if (app.category) {
    const allApps = await getAllOpalApps();
    relatedApps = allApps
      .filter(a => a.category === app.category && a.slug !== app.slug)
      .slice(0, 3);
  }

  // 结构化数据 (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": lang === 'zh' ? (app.title_zh || app.title) : app.title,
    "description": lang === 'zh' ? (app.description_zh || app.description) : app.description,
    "applicationCategory": app.category || "AI Application",
    "operatingSystem": "Google Opal",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    ...(app.opal_official_url && {
      "url": app.opal_official_url
    })
  };

  const appTitle = lang === 'zh' ? (app.title_zh || app.title) : app.title;
  const appDescription = lang === 'zh' ? (app.description_zh || app.description) : app.description;
  const appOverview = lang === 'zh' ? (app.overview_md_zh || app.overview_md) : app.overview_md;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#030315] to-[#06061a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OpalLanguageSync />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section - 视觉中心 */}
          <div className="mb-12 relative">
            {/* 背景光晕效果 */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl rounded-full opacity-60 -z-10" />
            <div className="absolute -top-10 right-20 w-72 h-72 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 blur-3xl rounded-full opacity-50 -z-10" />
            
            <div className="flex flex-col lg:flex-row items-start gap-6 mb-8">
              {/* Icon 展示 */}
              {app.icon && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="text-6xl">{app.icon}</div>
                </div>
              )}
              
              <div className="flex-1">
                {/* 主标题 */}
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {appTitle}
                </h1>
                
                {/* 副标题 */}
                {appDescription && (
                  <p className="text-lg text-gray-400 mb-6 leading-relaxed max-w-3xl">
                    {appDescription}
                  </p>
                )}

                {/* 操作栏 */}
                <div className="flex flex-wrap gap-4 items-center">
                  {app.opal_official_url && (
                    <a
                      href={app.opal_official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                    >
                      {lang === 'zh' ? '在 Google Opal 中试用 ↗' : 'Try in Google Opal ↗'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  {/* Share Button */}
                  <OpalShareButton slug={slug} lang={lang} />
                </div>

                {/* Category and Tags */}
                {(app.category || app.tags) && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {app.category && (
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                        {app.category}
                      </span>
                    )}
                    {app.tags && app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧内容区 (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Markdown Content */}
              {appOverview && (
                <div className="rounded-2xl border border-white/10 bg-[#1a1a2e]/50 backdrop-blur-sm p-8 shadow-xl">
                  <div className="prose prose-invert max-w-none 
                    prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-base
                    prose-li:text-gray-400 prose-li:leading-relaxed
                    prose-headings:text-white prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                    <ReactMarkdown>{appOverview}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Pro Version Upsell Card */}
              {relatedWorkflows.length > 0 && (
                <div className="rounded-2xl border-2 border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm p-8 shadow-xl relative overflow-hidden">
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-3">
                          {lang === 'zh' 
                            ? '🚀 解锁自动化：构建专业版'
                            : '🚀 Unlock Automation: Build the Pro Version'}
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-6">
                          {lang === 'zh'
                            ? 'Opal 擅长生成内容，但 n8n 可以自动化整个工作流程。这些专业版工作流可以帮助你构建更强大的自动化解决方案：'
                            : 'Opal generates text, but n8n automates the work. These Pro Version workflows can help you build more powerful automation solutions:'}
                        </p>
                      </div>
                    </div>

                    {/* 工作流卡片网格 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relatedWorkflows.map((workflow, index) => (
                        <div key={workflow.id} className="transform transition-transform hover:scale-[1.02]">
                          <WorkflowCard workflow={workflow} index={index} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧侧边栏 (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* About Opal Card */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {lang === 'zh' ? '关于 Google Opal' : 'About Google Opal'}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {lang === 'zh'
                      ? 'Google Opal 是一个简化的 AI 应用构建器，由 Gemini 模型驱动。它允许用户使用自然语言提示创建特定的 AI 工具，无需编程知识。'
                      : 'Google Opal is a simplified AI app builder powered by Gemini models. It allows users to create specific AI tools using natural language prompts, no coding required.'}
                  </p>
                </div>

                {/* Official Resources Card */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {lang === 'zh' ? '官方资源' : 'Official Resources'}
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="https://opal.google"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
                      >
                        <Globe className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                        <span>{lang === 'zh' ? 'Google Opal 官方网站' : 'Google Opal Official Site'}</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://developers.google.com/opal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
                      >
                        <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                        <span>{lang === 'zh' ? 'Opal 开发者文档' : 'Opal Developer Docs'}</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  </ul>
                </div>

                {/* App Metadata Card */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {lang === 'zh' ? '应用信息' : 'App Metadata'}
                  </h3>
                  <dl className="space-y-3">
                    {app.category && (
                      <div>
                        <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {lang === 'zh' ? '分类' : 'Category'}
                        </dt>
                        <dd className="text-sm text-gray-300">{app.category}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {lang === 'zh' ? '平台' : 'Platform'}
                      </dt>
                      <dd className="text-sm text-gray-300">Gemini Nano / Google Chrome</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {lang === 'zh' ? '费用' : 'Cost'}
                      </dt>
                      <dd className="text-sm text-gray-300">Free</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 底部相关推荐 */}
          {relatedApps.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-6">
                {lang === 'zh' ? '你可能也喜欢' : 'You might also like'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedApps.map((relatedApp) => (
                  <OpalCard key={relatedApp.id} app={relatedApp} lang={lang} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
