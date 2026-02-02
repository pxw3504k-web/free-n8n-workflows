"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Globe,
  BarChart3,
  ListChecks,
  ChevronRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/seo_advise';

interface SeoResult {
  url: string;
  score: number;
  summary: string;
  recommendations: string[];
  technical_details: {
    has_h1: boolean;
    has_meta_tags: boolean;
    has_structured_data: boolean;
    visible_text_length: number;
    robots_txt_url?: string;
  };
}

export function SeoAuditTool() {
  const { t, language } = useLanguage();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SeoResult | null>(null);
  const [localHistory, setLocalHistory] = useState<SeoResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chatInput: url.trim(),
            api_key: 'trial_mode' 
        })
      });

      if (!response.ok) throw new Error('Audit failed');

      const data = await response.json();
      const newResult = data as SeoResult;
      setResult(newResult);
      setLocalHistory(prev => [newResult, ...prev].slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80 || score >= 8) return 'text-emerald-400';
    if (score >= 50 || score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <ToolLayout 
      title={t('seo.audit.title')} 
      description={t('seo.audit.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Input Card */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Search className="w-32 h-32" />
             </div>
             
             <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                    <input 
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('common.status.processing')}
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        {t('common.generate')}
                      </>
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                  </div>
                )}
             </form>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-96 bg-white/5 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center p-12"
              >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="w-8 h-8 text-blue-500/50" />
                    </div>
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-white italic">Simulating Googlebot...</h3>
                  <p className="mt-2 text-gray-500 max-w-xs mx-auto text-sm">We are crawling your site structure and analyzing metadata for performance insights.</p>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Score & Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Score Gauge */}
                  <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 relative">Authority Score</h4>
                      
                      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                           <motion.circle 
                              cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                              strokeDasharray={440}
                              initial={{ strokeDashoffset: 440 }}
                              animate={{ strokeDashoffset: 440 - (440 * (result.score > 10 ? result.score / 100 : result.score / 10)) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={getScoreColor(result.score)}
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-5xl font-black italic tracking-tighter ${getScoreColor(result.score)}`}>
                                {result.score.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase mt-1">out of {result.score > 10 ? '100' : '10'}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs font-medium text-gray-400 max-w-[120px] leading-relaxed">Generated from architectural audit</p>
                  </div>

                  {/* Summary Card */}
                  <div className="md:col-span-8 bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
                      <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('seo.summary')}</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-blue-500/30 pl-6 py-2">
                        &ldquo;{result.summary}&rdquo;
                      </p>
                      
                      <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Target URL</span>
                              <p className="text-xs text-blue-400/80 truncate font-mono">{result.url}</p>
                          </div>
                          <div className="space-y-1">
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Audit Engine</span>
                              <p className="text-xs text-gray-400">LLM Deep Scanner v2.4</p>
                          </div>
                      </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <ListChecks className="w-5 h-5 text-purple-400" />
                        <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('seo.recommendations')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.recommendations.map((rec, i) => (
                            <motion.div 
                              key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start group hover:border-blue-500/30 transition-all"
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-gray-400 leading-relaxed">{rec}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Technical Health */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full" />
                    <div className="flex items-center gap-3 mb-8">
                        <ListChecks className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('seo.technical')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                            {result.technical_details.has_h1 ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">H1 Tag</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black">{result.technical_details.has_h1 ? 'Optimized' : 'Missing'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                            {result.technical_details.has_meta_tags ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Meta Tags</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black">{result.technical_details.has_meta_tags ? 'Found' : 'Missing'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                            {result.technical_details.has_structured_data ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Schema.org</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black">{result.technical_details.has_structured_data ? 'Valid' : 'Incomplete'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${result.technical_details.visible_text_length > 500 ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                             <span className="text-xs text-gray-400 font-medium">Rendered Content: <span className="text-white font-bold">{result.technical_details.visible_text_length} chars</span></span>
                         </div>
                         {result.technical_details.robots_txt_url && (
                             <a href={result.technical_details.robots_txt_url} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 font-bold underline italic">View robots.txt</a>
                         )}
                    </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-96 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner">
                      <Globe className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('common.status.ready')}</h3>
                  <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed italic">{t('seo.url.placeholder')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
            {localHistory.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <History className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('common.results')}</h3>
                    </div>
                    <div className="space-y-4">
                        {localHistory.map((item, i) => (
                            <button 
                                key={i} onClick={() => setResult(item)}
                                className="w-full text-left p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group"
                            >
                                <div className="flex items-center justify-between gap-3 overflow-hidden">
                                     <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-gray-300 truncate group-hover:text-white transition-colors">{item.url}</p>
                                        <span className="text-[10px] text-gray-500 uppercase font-black">Grade: {item.score.toFixed(1)}</span>
                                     </div>
                                     <div className={`w-8 h-8 rounded-lg ${getScoreColor(item.score).replace('text', 'bg').replace('400', '500/10')} flex items-center justify-center shrink-0`}>
                                        <ChevronRight className={`w-4 h-4 ${getScoreColor(item.score)}`} />
                                     </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-8 rounded-[2rem] bg-blue-600/10 border border-blue-600/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-12 h-12" />
                 </div>
                 <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2 italic">{t('common.pro.tip')}</h4>
                 <p 
                    className="text-xs text-blue-300/70 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: t('seo.audit.pro.tip', { 
                       meta: '<span class="font-bold text-blue-400">' + (language === 'zh' ? 'Meta 标签' : 'Meta Tags') + '</span>',
                       h1: '<span class="font-bold text-blue-400">' + (language === 'zh' ? 'H1 标题' : 'H1 Header') + '</span>'
                    }) }}
                 />
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
