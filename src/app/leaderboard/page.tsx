import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LeaderboardContent } from '@/components/leaderboard/LeaderboardContent';
import { WorkflowData, enrichWorkflowData } from '@/lib/data';

// Revalidate every hour
export const revalidate = 3600;

// 动态获取年份，让 SEO 永远显得"新鲜"
const currentYear = new Date().getFullYear();

// Site URL for OG images
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world';

export const metadata: Metadata = {
  // 1. Title 优化: 加入年份 + "Best" + "Free" 高频点击词
  title: `Best n8n Workflows ${currentYear}: Trending & Top Rated Templates | N8N Workflows`,
  
  // 2. Description 优化: 强调 "Verified" (已验证), "Free" (免费) 和 "No-Code" (无代码)
  description: `Stop debugging broken JSON. Discover the top ${currentYear} n8n automation workflows for AI, scraping, and productivity. 100% Verified, free to download, and daily updated rankings.`,
  
  keywords: [
    'n8n leaderboard',
    `best n8n workflows ${currentYear}`, // 带年份的长尾词
    'free n8n templates',      // "Free" 是搜索量巨大的修饰词
    'n8n ai agents',           // 蹭 AI 热点
    'automation ranking',
    'verified n8n json',       // 强调核心卖点
    'n8n community top rated',
    'n8n workflow rankings',
    'top rated n8n',
    'best n8n templates',
  ],
  
  // 3. OpenGraph 优化: 这对 Twitter/LinkedIn 分享至关重要
  openGraph: {
    title: `🏆 The Best n8n Workflows of ${currentYear} (Ranked)`,
    description: 'Don\'t waste time building from scratch. Download the most popular and verified n8n templates used by thousands of developers.',
    type: 'website',
    url: `${siteUrl}/leaderboard`,
    siteName: 'N8N Workflows',
    images: [
      {
        url: `${siteUrl}/api/og?title=${encodeURIComponent(`Best n8n Workflows ${currentYear}`)}&subtitle=${encodeURIComponent('Hall of Fame - Top Rated & Trending')}`,
        width: 1200,
        height: 630,
        alt: 'n8n Workflow Hall of Fame',
      },
    ],
    locale: 'en_US',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `🔥 Trending n8n Workflows: See who's #1 this week`,
    description: 'Discover verified automation templates. Stop guessing, start automating.',
    images: [`${siteUrl}/api/og?title=${encodeURIComponent(`Best n8n Workflows ${currentYear}`)}&subtitle=${encodeURIComponent('Hall of Fame - Top Rated & Trending')}`],
  },
  
  alternates: {
    canonical: `${siteUrl}/leaderboard`,
    // 使用参数式多语言，canonical 指向纯净的主 URL
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

export default async function LeaderboardPage() {
  // Fetch all three lists in parallel
  let [risingResult, topResult] = await Promise.all([
    // Rising/Trending workflows - 使用动态 RPC 函数
    supabase.rpc('get_weekly_trending_dynamic', { limit_count: 20 }),
    
    // Top downloaded workflows - 使用动态 RPC 函数
    supabase.rpc('get_all_time_top_dynamic', { limit_count: 20 }),
  ]);

  // New verified workflows - 直接查表
  const newResult = await supabase
    .from('workflows')
    .select('*')
    .eq('is_verified', true)
    .order('created_at', { ascending: false })
    .limit(20);

  // Fallback for Rising/Trending if RPC function doesn't exist
  if (risingResult.error) {
    console.warn('RPC function get_weekly_trending_dynamic not available, using fallback');
    risingResult = await supabase
      .from('workflows')
      .select('*')
      .order('stats->downloads', { ascending: false })
      .limit(20);
  }

  // Fallback for Top Downloads if RPC function doesn't exist
  if (topResult.error) {
    console.warn('RPC function get_all_time_top_dynamic not available, using fallback');
    topResult = await supabase
      .from('workflows')
      .select('*')
      .order('stats->downloads', { ascending: false })
      .limit(20);
  }

  // Process and enrich the data
  const risingList = (risingResult.data || []).map(enrichWorkflowData) as WorkflowData[];
  const topList = (topResult.data || []).map(enrichWorkflowData) as WorkflowData[];
  const newList = (newResult.data || []).map(enrichWorkflowData) as WorkflowData[];

  // Log any errors (but don't crash the page)
  if (risingResult.error) console.error('Error fetching trending workflows:', risingResult.error);
  if (topResult.error) console.error('Error fetching top downloads:', topResult.error);
  if (newResult.error) console.error('Error fetching new verified workflows:', newResult.error);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <LeaderboardContent 
        risingList={risingList}
        topList={topList}
        newList={newList}
      />

      <Footer />
    </div>
  );
}

