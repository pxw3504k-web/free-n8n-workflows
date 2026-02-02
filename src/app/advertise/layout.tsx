import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise with Us - Reach Automation Experts | N8N Workflows',
  description: 'Reach thousands of automation experts and decision makers. Promote your product to a high-intent technical audience on the premier n8n workflows platform.',
  keywords: [
    'advertise',
    'advertising',
    'sponsorship',
    'n8n workflows',
    'automation platform',
    'developer audience',
    'tech advertising',
  ],
  openGraph: {
    title: 'Advertise with Us - Reach Automation Experts',
    description: 'Reach thousands of automation experts and decision makers. Promote your product to a high-intent technical audience.',
    type: 'website',
    url: 'https://n8nworkflows.world/advertise',
    siteName: 'N8N Workflows',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advertise with Us - Reach Automation Experts',
    description: 'Reach thousands of automation experts and decision makers.',
  },
  alternates: {
    canonical: 'https://n8nworkflows.world/advertise',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
