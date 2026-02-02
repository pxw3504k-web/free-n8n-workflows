import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToolsLanguageSync } from '@/components/tools/ToolsLanguageSync';
import ToolContent from './ToolContent';

const TOOL_METADATA: Record<string, { title: string; description: string }> = {
  'seo-audit': { title: 'AI SEO Audit Tool', description: 'Simulate search engine crawlers and analyze SEO readability with AI.' },
  'b2b-leads': { title: 'B2B Leads Discovery Engine', description: 'Discover high-intent business leads and contact intelligence using AI.' },
  'reddit-opportunity': { title: 'Market Gap Extractor', description: 'Mine Reddit community discussions for verified business pain points.' },
  'article-illustrator': { title: 'AI Article Illustrator', description: 'Generate storyboard scripts and illustrations automatically from content.' },
  'magic-inpainting': { title: 'Smart Image Inpainting', description: 'Erase or replace objects in images with neural background filling.' },
  'product-photo': { title: 'Ecommerce Photo Generator', description: 'Create high-conversion product scenes using AI and computer vision.' },
  'product-hunt': { title: 'Product Hunt Daily Pulse', description: 'Get real-time insights into today\'s top trending tech products.' },
  'brand-sentiment': { title: 'Brand Sentiment Monitoring', description: 'Track brand reputation and community sentiment across social platforms.' },
  'invoice-extractor': { title: 'Smart Invoice Recognition', description: 'Extract structured data from PDF and image invoices automatically.' },
  'reddit-article': { title: 'Viral Article Generator', description: 'Transform trending Reddit topics into high-engagement articles.' },
  'reddit-hotspot': { title: 'Subreddit Pulse Monitor', description: 'Track viral growth and trending hotspots in specific communities.' },
  'company-research': { title: 'Deep Company Due Diligence', description: 'AI-powered market positioning and competitive intelligence.' },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = TOOL_METADATA[slug] || { title: 'AI Automation Tool', description: 'Enterprise-grade AI automation workflow.' };
  
  return {
    keywords: [`${meta.title.toLowerCase()}`, 'ai tool', 'automation', 'n8n workflow', 'productivity'],
    openGraph: {
      title: `${meta.title} | N8N Workflows`,
      description: meta.description,
      type: 'website',
      url: `https://ayn8n.ai/tools/${slug}`,
      siteName: 'ayn8n',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} - AI Automation Tool`,
      description: meta.description,
    },
    alternates: {
      canonical: `https://ayn8n.ai/tools/${slug}`,
    },
  };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = TOOL_METADATA[slug] || { title: 'AI Automation Tool', description: 'Enterprise-grade AI automation workflow.' };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: meta.title,
    description: meta.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Cloud',
    offers: {
      '@type': 'Offer',
      price: '4.90',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '124'
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050510]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsLanguageSync />
      <Header />
      <main className="flex-1 pt-16">
        <ToolContent />
      </main>
      <Footer />
    </div>
  );
}
