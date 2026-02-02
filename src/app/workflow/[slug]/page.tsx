import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWorkflow, getRelatedWorkflows, getRelatedIntegrations, getCollections } from '@/lib/data';
import { getAuthorById, getAuthorByName } from '@/lib/authors';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkflowDetailHeader } from '@/components/WorkflowDetailHeader';
import { WorkflowDetailContent } from '@/components/WorkflowDetailContent';
import { WorkflowDetailSidebar } from '@/components/WorkflowDetailSidebar';
import { WorkflowPreviewSection } from '@/components/WorkflowPreviewSection';
import { RelatedWorkflows } from '@/components/RelatedWorkflows';

interface PageProps {
  params: Promise<{ slug: string }>;
  // searchParams will be provided by Next.js when available
  searchParams?: Record<string, string | string[]>;
}

export async function generateMetadata({ params, searchParams }: PageProps & { searchParams?: Record<string, string | string[]> }): Promise<Metadata> {
  const { slug } = await params;
  const workflow = await getWorkflow(slug);

  if (!workflow) {
    return {
      title: 'Workflow Not Found | N8N Workflows',
      description: 'The workflow you are looking for could not be found. Browse our collection of verified n8n automation templates.',
    };
  }

  // 动态获取年份
  const currentYear = new Date().getFullYear();
  
  // Determine language from searchParams.lang if provided (fallback to 'en')
  const resolvedSearchParams = ((await (searchParams as unknown)) as Record<string, string | string[]>) || {};
  const lang = (typeof resolvedSearchParams?.lang === 'string' ? resolvedSearchParams.lang : (Array.isArray(resolvedSearchParams?.lang) ? resolvedSearchParams?.lang[0] : 'en')) || 'en';

  // Choose localized fields when available
  const titleText = lang.toLowerCase() === 'zh' ? (workflow.title_zh || workflow.title) : (workflow.title || workflow.title_zh);
  const descriptionText = lang.toLowerCase() === 'zh' ? (workflow.summary_short_zh || workflow.summary_short) : (workflow.summary_short || workflow.summary_short_zh);

  // Build OG image URL using our /api/og route
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
  const titleForOg = titleText || 'Free n8n Workflow';
  // Use tags as node placeholders (comma-separated)
  const nodesParam = (workflow.tags || []).slice(0, 8).join(',');
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og?title=${encodeURIComponent(titleForOg)}&nodes=${encodeURIComponent(nodesParam)}`;

  // 获取统计数据
  const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
  const downloads = stats?.downloads || 0;
  
  // 构建社会证明文案
  const socialProof = downloads > 100 ? `${downloads}+ downloads` : downloads > 10 ? `${downloads} downloads` : 'Verified workflow';
  
  // SEO 优化的标题：核心关键词 + 社会证明 + 年份
  const seoTitle = `${titleText} - Free n8n Workflow ${currentYear} (${socialProof}) | N8N Templates`;
  
  // SEO 优化的描述：痛点 + 解决方案 + CTA
  const seoDescription = descriptionText 
    ? `⚡ ${descriptionText} Download this verified n8n automation template for free. Copy-paste ready JSON. No coding required. Trusted by ${downloads > 0 ? `${downloads}+ users` : 'the community'}.`
    : `Download this verified n8n workflow template for free. Pre-built automation ready to copy and use. ${socialProof}. Start automating in minutes.`;

  // 构建关键词（基于 workflow 的 category 和 tags）
  const keywords: string[] = [
    titleText,
    `${titleText} n8n`,
    'free n8n workflow',
    'n8n template',
    'n8n automation',
    workflow.category,
    ...(workflow.tags || []).slice(0, 5),
    'verified n8n json',
    `n8n ${workflow.category} automation`,
    'no-code automation',
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    
    openGraph: {
      title: `🚀 ${titleText} - Verified n8n Workflow`,
      description: `Copy this automation template now. ${socialProof}. ${descriptionText || 'Ready-to-use n8n workflow with full JSON included.'}`,
      type: 'article',
      url: `${siteUrl.replace(/\/$/, '')}/workflow/${slug}`,
      siteName: 'N8N Workflows',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${titleText} - n8n Workflow Diagram`,
        },
      ],
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      // 文章相关的 OpenGraph 属性
      ...(workflow.created_at && {
        publishedTime: workflow.created_at,
      }),
      ...(workflow.author && {
        authors: [workflow.author],
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `⚡ ${titleText} - Copy this n8n workflow`,
      description: `${socialProof}. Get the full JSON for free. ${descriptionText ? descriptionText.slice(0, 100) + '...' : 'Ready to use.'}`,
      images: [ogImageUrl],
      creator: workflow.author ? `@${workflow.author.replace(/[^a-zA-Z0-9_]/g, '')}` : '@n8n_io',
    },
    
    alternates: {
      canonical: `${siteUrl.replace(/\/$/, '')}/workflow/${slug}`,
      // 只在有多语言内容时才添加 languages
      ...(workflow.title_zh && {
        languages: {
          'en-US': `${siteUrl.replace(/\/$/, '')}/workflow/${slug}`,
          'zh-CN': `${siteUrl.replace(/\/$/, '')}/workflow/${slug}?lang=zh`,
        },
      }),
    },
    
    // 额外的 SEO 优化
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
    
    // 文章相关的元数据
    ...(workflow.author && {
      authors: [{ name: workflow.author }],
    }),
    
    category: workflow.category,
  };
}

export default async function WorkflowPage({ params }: PageProps) {
  const { slug } = await params;
  const workflow = await getWorkflow(slug);

  if (!workflow) {
    notFound();
  }

  // 获取推荐工作流（6个，确保SEO可以抓取足够的内部链接）
  const relatedWorkflows = await getRelatedWorkflows(workflow, 6);
  
  // 获取相关集成组合（5-10个）
  const relatedIntegrations = await getRelatedIntegrations(workflow, 10);

  // 获取相关集合（用于面包屑）
  // 策略：1. 优先选择包含该工作流的集合 2. 选择热门集合 3. 选择第一个集合
  const allCollections = await getCollections();
  let relatedCollection = allCollections.find(c => {
    // 检查集合是否包含该工作流
    const workflowIds = c.collection_items?.map(item => item.workflow_id) || [];
    return workflowIds.includes(workflow.id);
  });
  
  // 如果没有找到包含该工作流的集合，选择热门集合
  if (!relatedCollection) {
    relatedCollection = allCollections.find(c => c.is_featured) || allCollections[0];
  }

  // 获取作者信息（优先使用 author_id，如果没有则使用 author 名称）
  let author = null;
  if (workflow.author_id) {
    console.log(`[WorkflowPage] Looking up author by ID for workflow ${slug}: "${workflow.author_id}"`);
    author = await getAuthorById(workflow.author_id);
    if (author) {
      console.log(`[WorkflowPage] Found author by ID: ${author.name} (slug: ${author.slug})`);
    } else {
      console.log(`[WorkflowPage] No author found for ID: "${workflow.author_id}"`);
    }
  } else if (workflow.author) {
    console.log(`[WorkflowPage] Looking up author by name for workflow ${slug}: "${workflow.author}"`);
    author = await getAuthorByName(workflow.author);
    if (author) {
      console.log(`[WorkflowPage] Found author by name: ${author.name} (slug: ${author.slug})`);
    } else {
      console.log(`[WorkflowPage] No author found for name: "${workflow.author}"`);
    }
  } else {
    console.log(`[WorkflowPage] Workflow ${slug} has no author_id or author field`);
  }

  // 提取主要节点名称（用于面包屑）
  // 优先使用 stats_data.top_nodes，否则使用 tags 中的第一个
  let mainNodeName: string | null = null;
  if (workflow.stats_data?.top_nodes && Object.keys(workflow.stats_data.top_nodes).length > 0) {
    // 获取使用次数最多的节点
    const topNode = Object.entries(workflow.stats_data.top_nodes)
      .sort(([, a], [, b]) => b - a)[0];
    mainNodeName = topNode[0];
  } else if (workflow.tags && workflow.tags.length > 0) {
    // 使用第一个 tag 作为节点名称
    mainNodeName = workflow.tags[0];
  }

  // Structured Data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
  const workflowUrl = `${siteUrl.replace(/\/$/, '')}/workflow/${slug}`;
  
  const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
  
  // Main SoftwareApplication schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": workflow.title,
    "headline": workflow.summary_short, // 增加 headline
    "description": workflow.summary_short || `${workflow.title} - n8n automation workflow`,
    "applicationCategory": workflow.category,
    "operatingSystem": "Windows, macOS, Linux, Docker",
    "url": workflowUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "Free N8N"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (() => {
        const rawRating = Number(stats?.stars || 5);
        return Math.min(rawRating, 5).toFixed(1);
      })(),
      "bestRating": "5",
      "worstRating": "1",
      // Ensure reviewCount is at least 1, and use downloads as proxy
      // Google typically requires at least 1 review to show stars
      // 修复4: 确保评分人数至少为 1 (Google 强制要求)
      "ratingCount": Math.max(Number(stats?.downloads || 0), 1).toString()
    },
    "downloadUrl": workflowUrl,
    "fileFormat": "application/json"
  };

  // FAQPage schema for SEO
  const faqJsonLd = workflow.faq_data && Array.isArray(workflow.faq_data) && workflow.faq_data.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": workflow.faq_data.map((faq: { question: string; answer: string }) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // HowTo schema for SEO - Parse steps from how_to_use_md
  const howToJsonLd = (() => {
    // Get how_to_use_md content (prefer English, fallback to Chinese)
    const howToContent = workflow.how_to_use_md || workflow.how_to_use_md_zh || '';
    
    if (!howToContent || howToContent.trim().length === 0) {
      return null;
    }

    // Parse markdown to extract steps
    // Support both numbered lists (1., 2., etc.) and unordered lists (-, *, etc.)
    const stepPatterns = [
      /^\d+\.\s+(.+)$/gm,           // Numbered list: "1. Step text"
      /^[-*]\s+(.+)$/gm,             // Unordered list: "- Step text" or "* Step text"
      /^(\d+)\)\s+(.+)$/gm,          // Numbered with parens: "1) Step text"
    ];

    const steps: string[] = [];
    
    // Try each pattern to extract steps
    for (const pattern of stepPatterns) {
      const matches = howToContent.matchAll(pattern);
      for (const match of matches) {
        const stepText = match[1] || match[2] || '';
        // Clean up markdown formatting (remove bold, links, etc.)
        const cleanedStep = stepText
          .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold **text**
          .replace(/\*(.+?)\*/g, '$1')      // Remove italic *text*
          .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links [text](url) -> text
          .replace(/`(.+?)`/g, '$1')        // Remove code `text`
          .trim();
        
        if (cleanedStep && cleanedStep.length > 0) {
          steps.push(cleanedStep);
        }
      }
      
      // If we found steps with this pattern, use them
      if (steps.length > 0) {
        break;
      }
    }

    // If no structured steps found, try to split by newlines and use paragraphs
    if (steps.length === 0) {
      const lines = howToContent.split('\n').filter(line => line.trim().length > 0);
      // Use first few meaningful lines as steps
      lines.slice(0, 10).forEach(line => {
        const cleaned = line
          .replace(/^#{1,6}\s+/, '')  // Remove markdown headers
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/\[(.+?)\]\(.+?\)/g, '$1')
          .replace(/`(.+?)`/g, '$1')
          .trim();
        
        if (cleaned && cleaned.length > 10) { // Only include substantial steps
          steps.push(cleaned);
        }
      });
    }

    // Only generate HowTo if we have at least 2 steps
    if (steps.length < 2) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to use ${workflow.title}`,
      "description": workflow.summary_short || `Step-by-step guide to use ${workflow.title} workflow`,
      "step": steps.map((stepText, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "text": stepText,
        "name": stepText.length > 50 ? stepText.substring(0, 50) + '...' : stepText
      })),
      "totalTime": "PT10M", // Default 10 minutes, can be customized if available
      "tool": {
        "@type": "SoftwareApplication",
        "name": "n8n",
        "applicationCategory": "Workflow Automation"
      }
    };
  })();

  // Review/Comment schema - Always generate for better SEO
  // Priority: Use reddit_comments if available, otherwise use stats-based review
  const reviewJsonLd = (() => {
    const comments = workflow.reddit_comments;
    const hasRedditComments = comments && Array.isArray(comments) && comments.length > 0;
    
    if (hasRedditComments && comments) {
      // Use Reddit comments for review
      return {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": workflow.title,
          "url": workflowUrl
        },
        "reviewBody": comments.map((comment: { body?: string; author?: string }) => 
          comment.body || ''
        ).filter(Boolean).join(' '),
        "author": {
          "@type": "Organization",
          "name": "Reddit Community"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": (() => {
            const scores = comments
              .map((c: { score?: number }) => c.score || 0)
              .filter((s: number) => s > 0);
            if (scores.length === 0) return "5";
            const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
            // Normalize to 1-5 scale (assuming Reddit scores can be high)
            return Math.min(Math.max(avg / 10, 1), 5).toFixed(1);
          })()
        }
      };
    }
 else {
      // Generate review based on stats for all workflows
      const rawRating = Number(stats?.stars || 5);
      const normalizedRating = Math.min(rawRating, 5);
      const reviewCount = Math.max(Number(stats?.downloads || 0), 1);
      
      // Only generate review if we have meaningful data
      if (reviewCount >= 1) {
        return {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": workflow.title,
            "url": workflowUrl
          },
          "reviewBody": workflow.summary_short || `Verified n8n workflow template: ${workflow.title}. ${reviewCount} ${reviewCount === 1 ? 'user' : 'users'} downloaded this automation template.`,
          "author": {
            "@type": "Organization",
            "name": "N8N Workflows Community"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": normalizedRating.toFixed(1),
            "bestRating": "5",
            "worstRating": "1"
          },
          "datePublished": workflow.created_at
        };
      }
    }
    return null;
  })();

  // Breadcrumb structured data for SEO
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      ...(relatedCollection ? [{
        "@type": "ListItem",
        "position": 2,
        "name": relatedCollection.title,
        "item": `${siteUrl}/collection/${relatedCollection.slug}`
      }] : []),
      ...(mainNodeName ? [{
        "@type": "ListItem",
        "position": relatedCollection ? 3 : 2,
        "name": mainNodeName,
        "item": `${siteUrl}/workflow/${slug}`
      }] : []),
      {
        "@type": "ListItem",
        "position": (relatedCollection ? 1 : 0) + (mainNodeName ? 1 : 0) + 2,
        "name": workflow.title,
        "item": workflowUrl
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main SoftwareApplication structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* FAQPage structured data for SEO */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* HowTo structured data for SEO */}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      {/* Review/Comment structured data for Reddit comments */}
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
        <WorkflowDetailHeader 
          workflow={workflow} 
          relatedCollection={relatedCollection || undefined}
          mainNodeName={mainNodeName || undefined}
        />
        
          {/* 工作流预览 - 横屏展示，优先显示 */}
          <div className="mb-12">
            <WorkflowPreviewSection workflow={workflow} />
          </div>

          {/* 详情信息和侧边栏 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <WorkflowDetailContent workflow={workflow} />
            </div>
            <div className="lg:col-span-1">
              <WorkflowDetailSidebar workflow={workflow} relatedIntegrations={relatedIntegrations} author={author} />
            </div>
          </div>

          {/* 推荐工作流 */}
          {relatedWorkflows.length > 0 && (
            <div className="mt-16">
              <RelatedWorkflows workflows={relatedWorkflows} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
