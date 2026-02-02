"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Rocket, 
  Loader2, 
  AlertTriangle, 
  ExternalLink,
  TrendingUp,
  ArrowUp,
  Globe,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/producthunt';

interface ProductItem {
  name: string;
  tagline: string;
  description: string;
  website: string;
}

export function ProductHuntDailyTool() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    setProducts([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: 'trial_mode' })
      });

      if (!response.ok) throw new Error('Fetch failed');

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('product.hunt.title')} 
      description={t('product.hunt.description')}
    >
      <div className="space-y-8">
        {/* Hero Header */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full -z-10" />
             
             <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center mb-8 mx-auto shadow-xl shadow-orange-500/20 rotate-3">
                <Rocket className="w-10 h-10 text-white" />
             </div>

             <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">{t('product.hunt.ranking')}</h2>
             <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed mb-10 italic font-medium">
                {t('product.hunt.description')}
             </p>

             <button
                onClick={fetchTrends}
                disabled={isLoading}
                className="px-12 py-5 rounded-3xl bg-white text-black font-black hover:bg-orange-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 mx-auto"
             >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
                {isLoading ? t('common.status.processing') : t('product.hunt.access')}
             </button>

             {error && (
                <div className="mt-8 text-red-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                </div>
             )}
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
            {products.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {products.map((product, i) => (
                        <motion.div 
                            key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-orange-500/50 transition-all shadow-2xl flex flex-col h-full"
                        >
                             <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-orange-500 font-black italic shadow-inner">
                                    #{i + 1}
                                </div>
                                <button 
                                    onClick={() => window.open(product.website, '_blank')}
                                    className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:bg-orange-600 transition-all"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                             </div>

                             <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors uppercase tracking-tight italic">{product.name}</h3>
                             <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-4">{product.tagline}</p>
                             
                             <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 italic group-hover:text-gray-400 transition-colors">
                                &ldquo;{product.description}&rdquo;
                             </p>

                             <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                                    <ArrowUp className="w-3 h-3" /> Trending
                                </div>
                                <button 
                                    onClick={() => window.open(product.website, '_blank')}
                                    className="px-4 py-2 rounded-full bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                                >
                                    View Launch <ArrowRight className="w-3 h-3" />
                                </button>
                             </div>
                             
                             {/* Decorative Background Element */}
                             <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-orange-600/5 blur-[40px] rounded-full group-hover:bg-orange-600/20 transition-all" />
                        </motion.div>
                    ))}
                </motion.div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[1,2,3,4,5,6].map(n => (
                        <div key={n} className="h-80 rounded-[2.5rem] bg-white/5 border border-white/5 animate-pulse" />
                     ))}
                </div>
            ) : null}
        </AnimatePresence>

        {/* Global Footer Info */}
        <div className="p-8 rounded-[2rem] bg-orange-600/5 border border-orange-600/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Real-time Transmission</h4>
                    <p className="text-xs text-gray-500 italic">Data processed via n8n automation clusters every 24 hours.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest underline decoration-orange-500/20 underline-offset-4 hover:decoration-orange-500">API Documentation</button>
                <div className="w-[1px] h-4 bg-white/10" />
                <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest underline decoration-orange-500/20 underline-offset-4 hover:decoration-orange-500">Enterprise Access</button>
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
