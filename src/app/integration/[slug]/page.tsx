import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import IntegrationDetailClient from '@/components/IntegrationDetailClient';
import { getIntegrationPair, getWorkflowsByIds } from '@/lib/data';
import { formatAppName } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const integrationPair = await getIntegrationPair(slug);

  if (!integrationPair) {
    return {
      title: 'Integration Not Found | N8N Workflows',
      description: 'The integration you are looking for could not be found. Browse our integration directory to find automation workflows.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const appAName = formatAppName(integrationPair.app_a);
  const appBName = formatAppName(integrationPair.app_b);
  const currentYear = new Date().getFullYear();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';

  // Build social proof
  const workflowCount = integrationPair.count || 0;
  const socialProof = workflowCount > 100 
    ? `${workflowCount}+ workflows` 
    : workflowCount > 10 
    ? `${workflowCount} workflows` 
    : 'Verified integration';

  // SEO-optimized title: App A + App B + Social Proof + Year
  const seoTitle = `${appAName} + ${appBName} Integration - ${socialProof} (${currentYear}) | Free n8n Workflows`;
  
  // SEO-optimized description: Value proposition + Social proof + CTA
  const seoDescription = integrationPair.ai_description 
    ? `⚡ ${integrationPair.ai_description} Download ${workflowCount > 0 ? `${workflowCount}+ free n8n workflows` : 'free automation templates'} connecting ${appAName} and ${appBName}. Copy-paste ready JSON. No coding required.`
    : `Automate workflows between ${appAName} and ${appBName} with n8n. Discover ${workflowCount > 0 ? `${workflowCount}+ ready-to-use automation templates` : 'free integration workflows'}. Sync data, trigger actions, and connect your favorite apps. Download free n8n workflows instantly.`;

  // Build OG image URL with formatted app names
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og?title=${encodeURIComponent(`${appAName} + ${appBName}`)}&type=integration&nodes=${encodeURIComponent(`${appAName},${appBName}`)}`;

  // Comprehensive keywords for SEO
  const keywords = [
    `${appAName} ${appBName} integration`,
    `${appAName} to ${appBName} n8n`,
    `connect ${appAName} to ${appBName}`,
    `${appAName} n8n workflow`,
    `${appBName} n8n workflow`,
    `${appAName} n8n integration`,
    `${appBName} n8n integration`,
    'n8n integration',
    'n8n workflow',
    'free n8n workflows',
    'n8n automation template',
    'automation template',
    `${appAName} automation`,
    `${appBName} automation`,
    'no-code integration',
    `n8n ${appAName.toLowerCase()}`,
    `n8n ${appBName.toLowerCase()}`,
    'workflow automation',
    'app integration',
    `integrate ${appAName} ${appBName}`,
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: `🔗 ${appAName} + ${appBName} - ${socialProof} | n8n Integration`,
      description: `${socialProof}. Automate workflows between ${appAName} and ${appBName}. Download free n8n templates. ${integrationPair.ai_description ? integrationPair.ai_description.slice(0, 100) + '...' : 'Ready-to-use automation workflows.'}`,
      type: 'article',
      url: `${siteUrl.replace(/\/$/, '')}/integration/${slug}`,
      siteName: 'N8N Workflows',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${appAName} and ${appBName} Integration - n8n Workflows`,
        },
      ],
      locale: 'en_US',
      // Article metadata
      ...(integrationPair.updated_at && {
        publishedTime: integrationPair.updated_at,
        modifiedTime: integrationPair.updated_at,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `⚡ ${appAName} + ${appBName} Integration`,
      description: `${socialProof}. Connect ${appAName} and ${appBName} with n8n. Download free automation workflows.`,
      images: [ogImageUrl],
      site: '@n8n_io',
      creator: '@n8n_io',
    },
    alternates: {
      canonical: `${siteUrl.replace(/\/$/, '')}/integration/${slug}`,
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
    // Additional metadata
    category: 'Integration',
    publisher: 'Free N8N',
  };
}

export default async function IntegrationPage({ params }: PageProps) {
  const { slug } = await params;
  const integrationPair = await getIntegrationPair(slug);

  if (!integrationPair) {
    notFound();
  }

  // Parse workflow_ids (handle both string and array)
  let workflowIds: string[] = [];
  try {
    if (typeof integrationPair.workflow_ids === 'string') {
      workflowIds = JSON.parse(integrationPair.workflow_ids);
    } else if (Array.isArray(integrationPair.workflow_ids)) {
      workflowIds = integrationPair.workflow_ids;
    }
    
    // Filter out any invalid IDs
    workflowIds = workflowIds.filter(id => id && typeof id === 'string' && id.trim().length > 0);
  } catch (error) {
    console.error('Error parsing workflow_ids:', error, integrationPair.workflow_ids);
    workflowIds = [];
  }

  // Fetch workflows
  const workflows = await getWorkflowsByIds(workflowIds);

  const appAName = formatAppName(integrationPair.app_a);
  const appBName = formatAppName(integrationPair.app_b);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `Connect ${appAName} and ${appBName} with n8n`,
    description: integrationPair.ai_description || `Integration workflows for ${appAName} and ${appBName}`,
    url: `${siteUrl}/integration/${slug}`,
    dateModified: integrationPair.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'N8N Workflows',
      url: siteUrl,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: appAName,
      },
      {
        '@type': 'SoftwareApplication',
        name: appBName,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a1e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <IntegrationDetailClient
        appAName={appAName}
        appBName={appBName}
        count={integrationPair.count}
        aiDescription={integrationPair.ai_description}
        workflows={workflows}
      />
      <Footer />
    </div>
  );
}

