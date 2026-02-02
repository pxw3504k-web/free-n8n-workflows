"use client";

import { useParams } from 'next/navigation';
import { SeoAuditTool } from '@/components/tools/SeoAuditTool';
import { BusinessLeadsTool } from '@/components/tools/BusinessLeadsTool';
import { RedditBusinessOpportunityTool } from '@/components/tools/RedditBusinessOpportunityTool';
import { ArticleIllustratorTool } from '@/components/tools/ArticleIllustratorTool';
import { MagicInpaintingTool } from '@/components/tools/MagicInpaintingTool';
import { ProductPhotoTool } from '@/components/tools/ProductPhotoTool';
import { ProductHuntDailyTool } from '@/components/tools/ProductHuntDailyTool';
import { BrandSentimentTool } from '@/components/tools/BrandSentimentTool';
import { InvoiceExtractorTool } from '@/components/tools/InvoiceExtractorTool';
import { RedditArticleGeneratorTool } from '@/components/tools/RedditArticleGeneratorTool';
import { RedditHotspotTool } from '@/components/tools/RedditHotspotTool';
import { CompanyResearchTool } from '@/components/tools/CompanyResearchTool';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolContent() {
  const { language, t } = useLanguage();
  const { slug } = useParams();

  const renderTool = () => {
    switch (slug) {
      case 'seo-audit': return <SeoAuditTool />;
      case 'b2b-leads': return <BusinessLeadsTool />;
      case 'reddit-opportunity': return <RedditBusinessOpportunityTool />;
      case 'article-illustrator': return <ArticleIllustratorTool />;
      case 'magic-inpainting': return <MagicInpaintingTool />;
      case 'product-photo': return <ProductPhotoTool />;
      case 'product-hunt': return <ProductHuntDailyTool />;
      case 'brand-sentiment': return <BrandSentimentTool />;
      case 'invoice-extractor': return <InvoiceExtractorTool />;
      case 'reddit-article': return <RedditArticleGeneratorTool />;
      case 'reddit-hotspot': return <RedditHotspotTool />;
      case 'company-research': return <CompanyResearchTool />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Tool Not Found</h2>
            <p className="text-gray-400">The tool you are looking for does not exist or is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Monetization CTA Bar - Sticky below header */}
      <div className="sticky top-16 z-40 bg-[#0a0a1a]/80 border-b border-indigo-500/20 backdrop-blur-md shadow-lg shadow-indigo-500/5">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-tight">
                {t('tools.title')}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Pro Template</span>
                <p className="text-gray-400 text-xs sm:text-sm font-medium">
                  {language === 'zh' ? '一次性支付 $4.9 获取完整生产级工作流' : 'Unlock full production workflow for $4.9 USD (One-time)'}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-black shadow-xl shadow-indigo-500/25 transition-all text-sm uppercase tracking-wider"
          >
            {t('tools.buyTemplate')}
          </motion.button>
        </div>
      </div>

      <div className="pt-4">
        {renderTool()}
      </div>
    </div>
  );
}
