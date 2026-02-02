'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { OpalApp } from '@/lib/data';
import { Home, ChevronRight } from 'lucide-react';
import { OpalCard } from './opal/OpalCard';

interface OpalDirectoryClientProps {
  apps: OpalApp[];
  siteUrl: string;
  lang?: string;
}

export default function OpalDirectoryClient({ apps, siteUrl, lang: initialLang }: OpalDirectoryClientProps) {
  const { language } = useLanguage();
  const lang = initialLang || language;

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Google Opal Templates Directory',
    description: 'Browse all available Google Opal templates and AI mini-apps',
      url: `${siteUrl}/googleopal`,
    numberOfItems: apps.length,
    publisher: {
      '@type': 'Organization',
      name: 'N8N Workflows',
      url: siteUrl,
    },
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'zh' ? '首页' : 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'zh' ? 'Opal 模版' : 'Opal Templates',
        item: `${siteUrl}/googleopal`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section - 40% of viewport */}
        <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 max-w-6xl py-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors flex items-center">
                <Home className="w-3 h-3 mr-1" />
                {lang === 'zh' ? '首页' : 'Home'}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-300">{lang === 'zh' ? 'Opal 模版' : 'Opal Templates'}</span>
            </nav>

            {/* Hero Content */}
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {lang === 'zh' ? 'Google Opal 模版画廊' : 'Google Opal Template Gallery'}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                {lang === 'zh' 
                  ? '非官方的优质 AI 小程序集合。精选生产力、营销和开发者工具。'
                  : 'The unofficial collection of high-quality AI mini-apps. Curated for productivity, marketing, and developers.'}
              </p>
            </div>
          </div>
        </section>

        {/* SEO Section - What is Google Opal? (Before Grid) */}
        <section className="container mx-auto px-4 max-w-4xl py-12">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {lang === 'zh' ? '什么是 Google Opal？' : 'What is Google Opal?'}
            </h2>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              {lang === 'zh' 
                ? 'Google Opal 是一个简化的 AI 应用构建器，由 Gemini 模型驱动。它允许用户使用自然语言提示创建特定的 AI 工具（如博客写作器或 SQL 生成器）。与复杂的编程环境不同，Opal 专注于日常任务的即时"小程序"。本目录收集了最好、经过验证的 Opal 模版，供您立即克隆和使用。'
                : 'Google Opal is a simplified AI app builder powered by Gemini models. It allows users to create specific AI tools (like Blog Writers or SQL Generators) using natural language prompts. Unlike complex coding environments, Opal focuses on instant "Mini-Apps" for everyday tasks. This directory collects the best, verified Opal templates for you to clone and use immediately.'}
            </p>
          </div>
        </section>

        {/* Apps Grid Section */}
        <section className="container mx-auto px-4 max-w-7xl py-8">
          {apps.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-gray-400">
                  {apps.length}+ {lang === 'zh' ? '个免费 AI 小程序模版' : 'free AI mini-app templates'}
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                  <OpalCard key={app.id} app={app} lang={lang} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400">
                {lang === 'zh' ? '暂无 Opal 模版' : 'No Opal templates available'}
              </p>
            </div>
          )}
        </section>

        {/* FAQ Section - SEO Optimization */}
        <section className="container mx-auto px-4 max-w-4xl py-16">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {lang === 'zh' 
                ? '关于 Google Opal 的常见问题'
                : 'Frequently Asked Questions about Google Opal'}
            </h2>
            
            <div className="space-y-6">
              {/* FAQ 1 - Can I automate Google Opal? */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {lang === 'zh' ? '我可以自动化 Google Opal 吗？' : 'Can I automate Google Opal?'}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {lang === 'zh' 
                    ? 'Opal 非常适合生成内容，但对于自动化（如发送电子邮件或保存到数据库），你应该将其与 n8n 配对使用。查看我们的"专业版"工作流。'
                    : 'Opal is great for generation, but for automation (like sending emails or saving to databases), you should pair it with n8n. Check our "Pro Version" workflows.'}
                </p>
              </div>

              {/* FAQ 2 - Are these templates free? */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {lang === 'zh' ? '这些模版是免费的吗？' : 'Are these templates free?'}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {lang === 'zh' 
                    ? '是的，这里列出的所有模版都可以在 Google Opal 中免费直接打开使用。'
                    : 'Yes, all templates listed here are free to open directly in Google Opal.'}
                </p>
              </div>

              {/* FAQ 3 - How to use these templates? */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {lang === 'zh' ? '如何使用这些模版？' : 'How to use these templates?'}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {lang === 'zh' 
                    ? '每个模版页面都提供了 "在 Opal 中试用" 按钮，点击后可以直接跳转到 Opal 平台使用该应用。你也可以查看关联的 n8n 工作流，构建更强大的自动化版本。'
                    : 'Each template page provides a "Try in Opal" button that takes you directly to the Opal platform. You can also check out the associated n8n workflows to build more powerful automation versions.'}
                </p>
              </div>

              {/* FAQ 4 - Difference between Opal and n8n */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {lang === 'zh' ? 'Opal 和 n8n 有什么区别？' : 'What\'s the difference between Opal and n8n?'}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {lang === 'zh' 
                    ? 'Google Opal 专注于快速创建 AI 小程序，适合非技术用户。n8n 是一个强大的工作流自动化平台，提供更多自定义选项和集成能力。许多 Opal 模版都有对应的 n8n 工作流版本，可以让你构建更专业的自动化解决方案。'
                    : 'Google Opal focuses on quickly creating AI mini-apps, perfect for non-technical users. n8n is a powerful workflow automation platform with more customization options and integration capabilities. Many Opal templates have corresponding n8n workflow versions, allowing you to build more professional automation solutions.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
