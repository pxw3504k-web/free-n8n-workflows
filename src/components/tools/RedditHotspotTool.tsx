"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  TrendingUp, 
  Loader2, 
  AlertTriangle, 
  Search,
  MessageCircle,
  ArrowBigUp,
  ExternalLink,
  Clock,
  LayoutGrid,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/hotspots';

interface RedditPost {
  title: string;
  selftext?: string;
  author?: string;
  subreddit_name_prefixed?: string;
  score?: number;
  num_comments?: number;
  thumbnail?: string;
  url?: string;
  permalink?: string;
  created_utc?: number;
}

export function RedditHotspotTool() {
  const { t } = useLanguage();
  const [subreddit, setSubreddit] = useState('ArtificialIntelligence');
  const [category, setCategory] = useState('top');
  const [limit, setLimit] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<RedditPost[]>([]);

  const fetchHotspots = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPosts([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subreddit, limit, category, api_key: 'trial_mode' })
      });

      if (!response.ok) throw new Error('Crawl failed');

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('reddit.hotspot.title')} 
      description={t('reddit.hotspot.description')}
    >
      <div className="space-y-12">
        {/* Control Console */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Globe className="w-32 h-32 rotate-12" />
             </div>

             <form onSubmit={fetchHotspots} className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('reddit.hotspot.source')}</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-black text-xs">r/</span>
                        <input 
                            value={subreddit} onChange={(e) => setSubreddit(e.target.value)}
                            className="w-full pl-8 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white italic font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('reddit.hotspot.algorithm')}</label>
                    <select 
                        value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer outline-none"
                    >
                        <option value="top">Top (Highest Score)</option>
                        <option value="hot">Hot (Trending Now)</option>
                        <option value="new">New (Latest Uploads)</option>
                        <option value="rising">Rising (Viral Potential)</option>
                    </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nodes</label>
                    <input 
                        type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}
                        className="w-full px-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white text-sm text-center font-mono outline-none"
                    />
                </div>

                <div className="md:col-span-3 flex items-end">
                    <button
                        type="submit"
                        disabled={isLoading || !subreddit.trim()}
                        className="w-full py-4 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-black hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
                        {isLoading ? t('common.status.processing') : t('reddit.hotspot.fetch')}
                    </button>
                </div>
             </form>

             {error && (
                <div className="mt-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs italic flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                </div>
             )}
        </div>

        {/* Results Stream */}
        <AnimatePresence mode="wait">
            {posts.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {posts.map((p, i) => (
                        <motion.div 
                            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 hover:border-emerald-500/30 transition-all flex flex-col relative overflow-hidden shadow-2xl"
                        >
                            {/* Vote Ribbon */}
                            <div className="absolute top-0 right-8 px-4 py-1 bg-emerald-500 rounded-b-xl text-black font-black text-[10px] italic shadow-lg">
                                {p.score} UPS
                            </div>

                            {/* Thumbnail */}
                            {p.thumbnail && p.thumbnail !== 'self' && p.thumbnail !== 'default' && (
                                <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={p.thumbnail.startsWith('http') ? p.thumbnail : `https://${p.thumbnail}`} alt="Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                            )}

                            <div className="flex-1 space-y-4">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{p.subreddit_name_prefixed}</span>
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight italic leading-tight">{p.title}</h3>
                                {p.selftext && <p className="text-sm text-gray-500 line-clamp-3 italic leading-relaxed">"{p.selftext}"</p>}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-600 uppercase">u/{p.author}</span>
                                    <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                        <MessageCircle className="w-3 h-3" /> {p.num_comments} comments
                                    </div>
                                </div>
                                <button 
                                    onClick={() => window.open(`https://reddit.com${p.permalink}`, '_blank')}
                                    className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-all shadow-xl"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Decorative Background Element */}
                            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-all" />
                        </motion.div>
                    ))}
                </motion.div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(n => (
                        <div key={n} className="h-96 rounded-[3rem] bg-white/5 border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="h-96 border-2 border-dashed border-white/10 rounded-[3rem] bg-[#050510] flex flex-col items-center justify-center text-center p-12">
                     <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                        <LayoutGrid className="w-10 h-10 text-gray-700" />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-2 italic">Awaiting Signal</h3>
                     <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                        Specify a subreddit to begin real-time monitoring of community hotspots and trending linguistic nodes.
                     </p>
                </div>
            )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
