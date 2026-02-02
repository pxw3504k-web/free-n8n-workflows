import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TrendingRow } from '@/components/home/TrendingRow';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowGrid } from '@/components/WorkflowGrid';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from '@/components/PageHeader';
import { CommunityVerifiedSection } from '@/components/CommunityVerifiedSection';
import { getWorkflows, getCategories, getVerifiedWorkflows } from '@/lib/data';

// 🚀 懒加载非关键组件以提升首屏性能
const Footer = dynamic(() => import('@/components/Footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-96 bg-[#1a1a2e]" />,
});

// Site URL for OG images
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/api/og?title=${encodeURIComponent('Free N8N Workflows - Download Templates')}&nodes=${encodeURIComponent('n8n,automation,workflow,templates')}`;

// 极具吸引力的首页 SEO 元数据
export const metadata: Metadata = {
  title: '8000+ Free N8N Workflows - Download Verified Templates & Automations',
  description: '🚀 Access 8000+ ready-to-use n8n workflow templates instantly. The largest community directory for automation JSON, APIs, and integrations. No signup required - just copy & import!',
  keywords: [
    'download n8n workflows',
    'n8n workflow templates',
    'free n8n automations',
    'n8n workflow download',
    'automation templates',
    'n8n integrations',
    'workflow automation',
    'n8n api workflows',
    'business automation',
    'n8n templates free'
  ],
  openGraph: {
    title: 'Download N8N Workflows - Free Templates & Automations',
    description: '🚀 Stop searching! Download 1000+ free n8n workflow templates instantly. Ready-to-use automations for APIs, integrations & business processes.',
    type: 'website',
    url: 'https://n8nworkflows.world',
    siteName: 'N8N Workflows',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Download N8N Workflows - Free automation templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download N8N Workflows - Free Templates',
    description: '🚀 Stop searching! Download 1000+ free n8n workflow templates instantly. Ready-to-use automations for your business.',
    images: [ogImageUrl],
    site: '@n8n_io',
  },
  alternates: {
    canonical: 'https://n8nworkflows.world',
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
  authors: [{ name: 'Free N8N Community' }],
  creator: 'Free N8N',
  publisher: 'Free N8N',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category.split(',') : [];
  const sort = typeof params.sort === 'string' ? params.sort : 'Most Popular';
  const page = typeof params.page === 'string' ? Number(params.page) : 1;
  const itemsPerPage = 12;

  // Fetch categories first to map IDs to names
  // getCategories() already returns counts, so we use those directly
  const categoriesData = await getCategories();
  
  // Map category IDs from URL to actual category names
  // Category IDs are generated as: name.toLowerCase().replace(/\s+/g, '-')
  // We need to convert them back to the original category names
  const categoryNames = categoryParam.length > 0 
    ? categoryParam.map(categoryId => {
        // Find the category by ID (which is lowercase with hyphens)
        const category = categoriesData.find(cat => cat.id === categoryId);
        if (category) {
          return category.name;
        }
        // Fallback: try to convert ID back to name format
        // e.g., "social-media" -> "Social Media"
        return categoryId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }).filter((name): name is string => name !== null && name !== '')
    : undefined;

  // Debug: log category filtering
  if (categoryNames && categoryNames.length > 0) {
    console.log('Filtering by categories:', categoryNames);
  }

  // Use categories data directly - it already has correct counts
  // getCategories() queries all workflows and counts by category, which is what we want
  const categoriesWithCounts = categoriesData.filter(cat => cat.count > 0);

  // Fetch real data from Supabase with caching
  const workflowsData = await getWorkflows({
      page,
      limit: itemsPerPage,
    category: categoryNames,
      sort,
  });

  const { data: workflows, count: totalCount } = workflowsData;

  // Fetch verified workflows for the Community Verified section
  const verifiedWorkflows = await getVerifiedWorkflows(6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <div className="container mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar categories={categoriesWithCounts} />
            
            <div className="flex-1 min-w-0">
              {/* Trending Row - Netflix Style Horizontal Scroll */}
              <TrendingRow />
              
              <PageHeader 
                showing={Math.min(workflows.length, itemsPerPage)} 
                total={totalCount} 
              />
              
              <WorkflowGrid workflows={workflows} />
              
              <Pagination 
                totalItems={totalCount}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>

          {/* Community Verified Section - Right side, below pagination */}
          {verifiedWorkflows.length > 0 && (
            <CommunityVerifiedSection workflows={verifiedWorkflows} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
