import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllOpalApps } from '@/lib/data';
import OpalDirectoryClient from '@/components/OpalDirectoryClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
const currentYear = new Date().getFullYear();

interface PageProps {
  searchParams?: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata(): Promise<Metadata> {
  // Fetch opal apps to get accurate count
  const apps = await getAllOpalApps();
  const totalApps = apps.length;

  // SEO-optimized title with dynamic data
  const seoTitle = `Google Opal Templates Directory - Free AI Mini-Apps ${currentYear} | N8N Workflows`;
  
  // SEO-optimized description
  const seoDescription = `Discover and use free Google Opal templates. The best collection of AI mini-apps for productivity, writing, and marketing. ${totalApps}+ free templates ready to use.`;

  // Build OG image URL
  const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og/googleopal?title=${encodeURIComponent(`Google Opal Templates Directory - ${totalApps}+ Templates`)}&icon=⚡`;

  // Comprehensive keywords for SEO
  const keywords = [
    'google opal templates',
    'opal templates directory',
    'free opal apps',
    'ai mini-apps',
    'google opal',
    'opal templates',
    'free ai apps',
    'productivity apps',
    'writing tools',
    'marketing tools',
    'google opal directory',
    'opal mini-apps',
    `google opal templates ${currentYear}`,
    'n8n alternative',
    'free automation templates',
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: `⚡ Google Opal Templates Directory - ${totalApps}+ Free AI Mini-Apps`,
      description: `Discover and use free Google Opal templates. The best collection of AI mini-apps for productivity, writing, and marketing. ${totalApps}+ free templates ready to use.`,
      type: 'website',
      url: `${siteUrl.replace(/\/$/, '')}/googleopal`,
      siteName: 'N8N Workflows',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Google Opal Templates Directory - ${totalApps}+ Free Templates`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Google Opal Templates Directory - ${totalApps}+ Free Templates`,
      description: `Discover and use free Google Opal templates. The best collection of AI mini-apps.`,
      images: [ogImageUrl],
      site: '@n8n_io',
      creator: '@n8n_io',
    },
    alternates: {
      canonical: `${siteUrl.replace(/\/$/, '')}/googleopal`,
      languages: {
        'en-US': `${siteUrl.replace(/\/$/, '')}/googleopal`,
        'zh-CN': `${siteUrl.replace(/\/$/, '')}/googleopal?lang=zh`,
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
    category: 'Opal Templates Directory',
    publisher: 'Free N8N',
  };
}

// ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function OpalDirectoryPage({ searchParams }: PageProps) {
  const apps = await getAllOpalApps();
  const resolvedSearchParams = (await searchParams) || {};
  const lang = typeof resolvedSearchParams?.lang === 'string' 
    ? resolvedSearchParams.lang 
    : (Array.isArray(resolvedSearchParams?.lang) ? resolvedSearchParams?.lang[0] : undefined);

  return (
    <>
      <Header />
      <OpalDirectoryClient apps={apps} siteUrl={siteUrl} lang={lang} />
      <Footer />
    </>
  );
}

