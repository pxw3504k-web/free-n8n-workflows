import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllIntegrationPairs } from '@/lib/data';
import IntegrationDirectoryClient from '@/components/IntegrationDirectoryClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
const currentYear = new Date().getFullYear();

export async function generateMetadata(): Promise<Metadata> {
  // Fetch integration pairs to get accurate count
  const integrations = await getAllIntegrationPairs();
  const totalIntegrations = integrations.length;
  const totalWorkflows = integrations.reduce((sum, i) => sum + i.count, 0);

  // SEO-optimized title with dynamic data
  const seoTitle = `n8n Integration Directory ${currentYear}: ${totalIntegrations}+ App Combinations & ${totalWorkflows}+ Free Workflows | N8N Workflows`;
  
  // SEO-optimized description with social proof
  const seoDescription = `Discover ${totalIntegrations}+ n8n integration combinations connecting popular apps like Slack, Google Sheets, GitHub, Discord, Gmail, Notion, Airtable, and more. ${totalWorkflows}+ free automation workflows ready to download. No coding required.`;

  // Build OG image URL
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og?title=${encodeURIComponent(`n8n Integrations Directory - ${totalIntegrations}+ Combinations`)}&type=directory`;

  // Comprehensive keywords for SEO
  const keywords = [
    'n8n integrations',
    'n8n integration directory',
    'workflow combinations',
    'app integrations',
    'n8n connectors',
    'automation templates',
    'connect apps with n8n',
    'n8n workflow templates',
    'free n8n workflows',
    'n8n automation',
    'no-code integration',
    'n8n app connectors',
    'workflow automation',
    'n8n templates',
    'integration workflows',
    `n8n integrations ${currentYear}`,
    'slack n8n integration',
    'google sheets n8n',
    'github n8n workflow',
    'notion n8n automation',
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: `🔗 n8n Integration Directory: ${totalIntegrations}+ App Combinations`,
      description: `Browse ${totalIntegrations}+ integration combinations and ${totalWorkflows}+ free n8n workflows. Connect Slack, Google Sheets, GitHub, Notion, and more. Download ready-to-use automation templates.`,
      type: 'website',
      url: `${siteUrl.replace(/\/$/, '')}/integration`,
      siteName: 'N8N Workflows',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `n8n Integrations Directory - ${totalIntegrations}+ Integration Combinations`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `n8n Integration Directory: ${totalIntegrations}+ Combinations`,
      description: `Discover ${totalIntegrations}+ integration combinations. ${totalWorkflows}+ free workflows. Connect your favorite apps with n8n automation.`,
      images: [ogImageUrl],
      site: '@n8n_io',
      creator: '@n8n_io',
    },
    alternates: {
      canonical: `${siteUrl.replace(/\/$/, '')}/integration`,
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
    category: 'Integration Directory',
    publisher: 'Free N8N',
  };
}

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export default async function IntegrationsDirectoryPage() {
  const integrations = await getAllIntegrationPairs();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';

  return (
    <>
      <Header />
      <IntegrationDirectoryClient integrations={integrations} siteUrl={siteUrl} />
      <Footer />
    </>
  );
}

