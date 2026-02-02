import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced AI Tools - Enterprise Workflow Trial',
  description: 'Experience professional AI automation tools for SEO audit, B2B leads, and digital content generation. No configuration required.',
  keywords: ['AI tools', 'automation workflows', 'SEO audit', 'B2B lead generation', 'content creation', 'business intelligence'],
  authors: [{ name: 'ayn8n Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ayn8n.ai/tools',
    title: 'Advanced AI Tools - Enterprise Workflow Trial',
    description: 'Experience professional AI automation tools for SEO audit, B2B leads, and digital content generation.',
    siteName: 'ayn8n',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced AI Tools - Enterprise Workflow Trial',
    description: 'Experience professional AI automation tools for SEO audit, B2B leads, and digital content generation.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Advanced AI Tools',
  description: 'A collection of enterprise-grade AI automation tools.',
  url: 'https://ayn8n.ai/tools',
  provider: {
    '@type': 'Organization',
    name: 'ayn8n',
    url: 'https://ayn8n.ai'
  }
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
