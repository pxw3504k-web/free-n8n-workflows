"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ExternalLink,
  MessageSquare,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/brand-sentiment';

interface SentimentPost {
  title: string;
  summary: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface SentimentResult {
  brand: string;
  sentiment_score: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  summary: string;
  key_topics: string[];
  crisis_alert: {
    detected: boolean;
    reason?: string;
  };
  top_posts: SentimentPost[];
}

export function BrandSentimentTool() {
  const { t } = useLanguage();
  const [brand, setBrand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            brand: brand.trim(),
            api_key: 'trial_mode' 
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (score: number) => {
    if (score >= 70) return 'bg-emerald-400';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <ToolLayout 
      title={t('brand.sentiment.title')} 
      description={t('brand.sentiment.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Search & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-2xl space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                {t('brand.sentiment.input.brand')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <input 
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder={t('brand.sentiment.input.placeholder')}
                        className="w-full px-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !brand.trim()}
                    className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-black hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6" />}
                    {isLoading ? t('brand.sentiment.status.scanning') : t('brand.sentiment.button.analyze')}
                </button>
            </form>

            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-4"
                    >
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('brand.sentiment.overall.reputation')}</h4>
                         <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                <motion.circle 
                                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={364}
                                    initial={{ strokeDashoffset: 364 }}
                                    animate={{ strokeDashoffset: 364 - (364 * result.sentiment_score / 100) }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={getSentimentColor(result.sentiment_score).replace('text', 'stroke')}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-black italic tracking-tighter ${getSentimentColor(result.sentiment_score)}`}>{result.sentiment_score}</span>
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">{t('brand.sentiment.score.label')}</span>
                            </div>
                         </div>
                         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${getSentimentBg(result.sentiment_score)}`}>
                            {result.sentiment_score >= 70 ? 'Stellar' : result.sentiment_score >= 40 ? 'Neutral' : 'Critical'}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 italic">
               <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Right: Insights & Voices */}
        <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div 
                        key="result-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Crisis Alert Bar */}
                        {result.crisis_alert.detected && (
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                className="p-6 rounded-2xl bg-red-600 text-white shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-500 flex items-center gap-6"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-xs">Reputation Crisis Detected</h4>
                                    <p className="text-sm font-medium text-red-100 mt-1 italic leading-relaxed">&ldquo;{result.crisis_alert.reason}&rdquo;</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Top posts / Mention List */}
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 lg:p-8 space-y-8">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    {t('brand.sentiment.conversations')}
                                </h3>
                                <div className="flex gap-2">
                                    {result.key_topics.map((t, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-tighter">#{t}</span>
                                    ))}
                                </div>
                             </div>

                             <div className="space-y-4">
                                {result.top_posts.map((post, i) => (
                                    <motion.div 
                                        key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                        className="group p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/20 transition-all flex gap-6 relative overflow-hidden"
                                    >
                                        <div className={`w-1 rounded-full self-stretch ${post.sentiment === 'positive' ? 'bg-emerald-500' : post.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`} />
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{post.title}</h4>
                                                {post.sentiment === 'positive' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : post.sentiment === 'negative' ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-gray-500" />}
                                            </div>
                                            <p className="text-sm text-gray-400 italic leading-relaxed">&ldquo;{post.summary}&rdquo;</p>
                                            <button 
                                                onClick={() => window.open(post.url, '_blank')}
                                                className="mt-2 text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                                            >
                                                {t('common.view.original')} <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                             </div>
                        </div>

                        {/* AI Summary Card */}
                        <div className="p-8 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-600/20 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Zap className="w-20 h-20 text-indigo-400" />
                             </div>
                             <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 italic">{t('brand.sentiment.ai.insight')}</h4>
                             <p className="text-gray-300 text-sm leading-relaxed font-serif italic">
                                &ldquo;{result.summary}&rdquo;
                             </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-[600px] border-2 border-dashed border-white/10 rounded-[3rem] bg-[#050510] flex flex-col items-center justify-center text-center p-12">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                            {isLoading ? <Loader2 className="w-10 h-10 text-blue-500 animate-spin" /> : <Activity className="w-10 h-10 text-gray-700" />}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 italic">Waiting for Signal...</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                            {isLoading 
                                ? 'Parsing Reddit nodes and analyzing linguistic nuances in real-time. Please wait for the neural evaluation to finish.' 
                                : 'Initialize a monitor by entering a brand or topic. Our AI will scan social signals to determine the global perception index.'}
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
}
