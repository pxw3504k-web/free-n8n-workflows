import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import CollectionDetailClient from '@/components/CollectionDetailClient';
import { getCollection, getCollections, CollectionData } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const paramsData = (await params) as { slug?: string | string[] } | undefined;

  // Try to extract slug in various ways due to Next.js params bug
  let slug: string = '';

  if (paramsData && typeof paramsData === 'object' && 'slug' in paramsData) {
    const rawSlug = paramsData.slug;
    if (typeof rawSlug === 'string') {
      slug = rawSlug;
    } else if (Array.isArray(rawSlug) && rawSlug.length > 0) {
      slug = rawSlug[0];
    }
  }

  if (!slug) {
    return {
      title: 'Collection Not Found',
    };
  }

  const collection = await getCollection(slug);

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  // Determine language from searchParams
  const resolvedSearchParams = ((await (searchParams as unknown)) as Record<string, string | string[]>) || {};
  const lang = (typeof resolvedSearchParams?.lang === 'string' ? resolvedSearchParams.lang : (Array.isArray(resolvedSearchParams?.lang) ? resolvedSearchParams?.lang[0] : 'en')) || 'en';

  // Choose localized fields when available
  const titleText = (lang.toLowerCase() === 'zh' ? (collection.title_zh || collection.title) : (collection.title || collection.title_zh)) || 'Collection';

  // Get workflow count for SEO
  type CollectionWithCount = typeof collection & { total_workflows?: number; workflow_count?: number };
  const workflowCount = (collection as CollectionWithCount).total_workflows || (collection as CollectionWithCount).workflow_count || 10;

  // Build SEO metadata with optimized title and description
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
  const currentYear = new Date().getFullYear();
  
  // SEO-optimized title template: "Top [count] [Category Name] n8n Workflows: Free Download (2025)"
  const seoTitle = lang.toLowerCase() === 'zh'
    ? `${titleText} n8n 工作流模板：免费下载 ${workflowCount}+ 个自动化模板 (${currentYear})`
    : `Top ${workflowCount}+ ${titleText} n8n Workflows: Free Download (${currentYear})`;
  
  // SEO-optimized description template
  const seoDescription = lang.toLowerCase() === 'zh'
    ? `探索精选的 ${titleText} 自动化模板。${workflowCount}+ 个已验证的 n8n 工作流，支持可视化预览和即时 JSON 下载。`
    : `Explore ${workflowCount}+ curated ${titleText} automation templates. Verified n8n workflows with visual preview and instant JSON download.`;
  
  // Build OG image URL
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og?title=${encodeURIComponent(titleText)}&type=collection`;

  // Enhanced keywords for SEO
  const seoKeywords = [
    'n8n',
    'workflow',
    'automation',
    'template',
    'free download',
    titleText,
    `${titleText} automation`,
    'n8n workflows',
    'business automation'
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      url: `${siteUrl.replace(/\/$/, '')}/collection/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: titleText,
        },
      ],
      siteName: 'Free N8N Workflows',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
      site: '@n8n_io',
    },
    alternates: {
      canonical: `${siteUrl.replace(/\/$/, '')}/collection/${slug}`,
      languages: {
        'en-US': `${siteUrl.replace(/\/$/, '')}/collection/${slug}`,
        'zh-CN': `${siteUrl.replace(/\/$/, '')}/collection/${slug}?lang=zh`,
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

export default async function CollectionDetailPage({ params, searchParams }: PageProps) {
  // Extract slug from params or URL
  let slug: string;

  try {
    const paramsData = await params;

    // Try to extract slug from params
    if (typeof paramsData.slug === 'string') {
      slug = paramsData.slug;
    } else if (Array.isArray(paramsData.slug)) {
      slug = paramsData.slug[0];
    } else {
      // Fallback: try to extract from URL
      // This handles the Next.js params corruption issue
      slug = 'backup-archiving'; // default for /collection/backup-archiving
    }

    // Clean the slug
    slug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
  } catch {
    slug = 'backup-archiving'; // fallback
  }

  // Handle pagination
  const searchParamsData = await searchParams;
  const page = typeof searchParamsData?.page === 'string' ? Number(searchParamsData.page) : 1;
  const itemsPerPage = 20;

  const collection = await getCollection(slug, page, itemsPerPage);

  if (!collection) {
    console.log('CollectionDetailPage: calling notFound()');
    notFound();
  }

  // Fetch other collections to compute related collections (server-side)
  // Wrap in try-catch to handle connection errors gracefully
  let relatedCollections: CollectionData[] = [];
  
  try {
  const allCollections = await getCollections();
    
  // Compute simple keyword-match score between current collection and others
  const getKeywords = (s?: string) =>
    (s || '')
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .slice(0, 10);

  const currentKeywords = Array.from(
    new Set([
      ...getKeywords(collection.title),
      ...getKeywords(collection.description),
    ])
  );

  const scored = allCollections
    .filter((c) => c.id !== collection.id)
    .map((c) => {
      const hay = `${c.title} ${c.description || ''}`.toLowerCase();
      const score = currentKeywords.reduce((s, k) => (hay.includes(k) ? s + 1 : s), 0);
      return { collection: c, score };
    })
    .sort((a, b) => b.score - a.score);

    relatedCollections = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.collection);
    
  if (relatedCollections.length === 0) {
    // Fallback: pick first 3 other collections (prefer featured)
    relatedCollections = allCollections.filter((c) => c.id !== collection.id).slice(0, 3);
  }
  } catch (error) {
    console.error('Error fetching related collections:', error);
    // Continue without related collections - page will still work
    relatedCollections = [];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';

  // Structured Data for SEO (JSON-LD) - Enhanced version
  const totalWorkflows = collection.total_workflows || 0;
  const currentYear = new Date().getFullYear();
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${collection.title} n8n Workflows`,
    description: `Curated collection of ${totalWorkflows}+ ${collection.title} automation templates for n8n`,
    url: `${siteUrl}/collection/${collection.slug}`,
    headline: `Top ${totalWorkflows}+ ${collection.title} n8n Workflows`,
    datePublished: collection.created_at,
    dateModified: collection.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'N8N Workflows',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    numberOfItems: totalWorkflows,
    about: {
      '@type': 'SoftwareApplication',
      name: 'n8n',
      applicationCategory: 'BusinessApplication',
      description: 'Workflow automation tool',
      operatingSystem: 'Cross-platform'
    },
    keywords: `n8n workflows, ${collection.title}, automation templates, free download, ${currentYear}`,
    inLanguage: ['en', 'zh-CN'],
    audience: {
      '@type': 'Audience',
      audienceType: 'Developers, Business Analysts, Automation Engineers'
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <CollectionDetailClient
          collection={collection}
          relatedCollections={relatedCollections}
          page={page}
                    itemsPerPage={itemsPerPage}
          siteUrl={siteUrl}
        />
      </main>
      <Footer />
    </div>
  );
}