"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToolCard } from '@/components/tools/ToolCard';
import { 
  Search, 
  Video, 
  Users, 
  Lightbulb, 
  PenTool, 
  Image as ImageIcon, 
  ShoppingBag, 
  Flame, 
  BarChart2, 
  FileText,
  Building2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolsLanguageSync } from '@/components/tools/ToolsLanguageSync';

export default function ToolsPage() {
  const { t } = useLanguage();

  const tools = [
    {
      title: t('seo.audit.title'),
      description: t('seo.audit.description'),
      icon: Search,
      slug: 'seo-audit'
    },
    {
      title: t('b2b.leads.title'),
      description: t('b2b.leads.description'),
      icon: Users,
      slug: 'b2b-leads'
    },
    {
      title: t('reddit.opportunity.title'),
      description: t('reddit.opportunity.subtitle'),
      icon: Lightbulb,
      slug: 'reddit-opportunity'
    },
    {
      title: t('article.illustrator.title'),
      description: t('article.illustrator.description'),
      icon: PenTool,
      slug: 'article-illustrator'
    },
    {
      title: t('magic.inpainting.title'),
      description: t('magic.inpainting.description'),
      icon: ImageIcon,
      slug: 'magic-inpainting'
    },
    {
      title: t('product.photo.title'),
      description: t('product.photo.description'),
      icon: ShoppingBag,
      slug: 'product-photo'
    },
    {
      title: t('product.hunt.title'),
      description: t('product.hunt.description'),
      icon: Flame,
      slug: 'product-hunt'
    },
    {
      title: t('brand.sentiment.title'),
      description: t('brand.sentiment.description'),
      icon: BarChart2,
      slug: 'brand-sentiment'
    },
    {
      title: t('invoice.extractor.title'),
      description: t('invoice.extractor.description'),
      icon: FileText,
      slug: 'invoice-extractor'
    },
    {
      title: t('reddit.article.title'),
      description: t('reddit.article.description'),
      icon: FileText,
      slug: 'reddit-article'
    },
    {
      title: t('reddit.hotspot.title'),
      description: t('reddit.hotspot.description'),
      icon: Flame,
      slug: 'reddit-hotspot'
    },
    {
      title: t('company.research.title'),
      description: t('company.research.description'),
      icon: Building2,
      slug: 'company-research'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <ToolsLanguageSync />
      <Header />
      <main className="flex-1 pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-gray-400">
              {t('tools.title')}
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              {t('tools.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} {...tool} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
