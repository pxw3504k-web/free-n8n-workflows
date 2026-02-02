"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Loader2, 
  Search,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Layout,
  Wand2,
  ArrowRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HOTSPOT_API = 'https://n8nwori.zeabur.app/webhook/hotspots';
const GENERATOR_API = 'https://n8nwori.zeabur.app/webhook/article-generator';

interface RedditPost {
  title: string;
  selftext?: string;
  author?: string;
  subreddit?: string;
  score?: number;
  permalink?: string;
}

export function RedditArticleGeneratorTool() {
  const { t } = useLanguage();
  const [subreddit, setSubreddit] = useState('ArtificialIntelligence');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<RedditPost | null>(null);
  const [style, setStyle] = useState('product_review');
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<{ title: string; content: string; digest?: string } | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<'md' | 'html' | null>(null);

  const fetchHotspots = async () => {
    setIsLoadingPosts(true);
    setError(null);
    try {
      const response = await fetch(HOTSPOT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subreddit, limit: 10, category: 'hot', api_key: 'trial_mode' })
      });
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Failed to fetch reddit posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const generateArticle = async () => {
    if (!selectedPost) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(GENERATOR_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedPost.title,
          selftext: selectedPost.selftext || selectedPost.title,
          url: selectedPost.permalink ? `https://www.reddit.com${selectedPost.permalink}` : '',
          style,
          api_key: 'trial_mode'
        })
      });
      const data = await response.json();
      // Handle response format: { title, content_html, digest }
      const result = data.data || data;
      setArticle({
        title: result.title,
        content: result.content_html || result.content,
        digest: result.digest
      });
    } catch (err) {
      setError('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout 
      title={t('reddit.article.generator.title')} 
      description={t('reddit.article.generator.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input & Source Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('reddit.article.generator.source')}</h4>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs">r/</span>
                        <input 
                            value={subreddit} onChange={(e) => setSubreddit(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    <button onClick={fetchHotspots} disabled={isLoadingPosts} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                        {isLoadingPosts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">{t('reddit.article.generator.select')}</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {posts.map((p, i) => (
                        <button 
                            key={i} onClick={() => setSelectedPost(p)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                                selectedPost === p ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black/20 hover:border-white/20'
                            }`}
                        >
                            <p className={`text-xs font-bold truncate pr-4 ${selectedPost === p ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{p.title}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">u/{p.author}</span>
                                <span className="text-[9px] font-black text-purple-400 uppercase tracking-tighter italic">Score: {p.score}</span>
                            </div>
                        </button>
                    ))}
                    {posts.length === 0 && !isLoadingPosts && <p className="text-[10px] text-gray-600 text-center py-8 italic">{t('reddit.article.generator.empty')}</p>}
                </div>
            </div>

            {selectedPost && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Input Parameters</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Title</label>
                            <input 
                                value={selectedPost.title} 
                                onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-purple-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Content</label>
                            <textarea 
                                value={selectedPost.selftext || selectedPost.title} 
                                onChange={(e) => setSelectedPost({...selectedPost, selftext: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-purple-500/50 resize-none custom-scrollbar"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">URL</label>
                            <input 
                                value={selectedPost.permalink ? `https://www.reddit.com${selectedPost.permalink}` : ''}
                                disabled
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-500 text-xs outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">{t('reddit.article.generator.style')}</h4>
                <div className="grid grid-cols-2 gap-2">
                    {['product_review', 'story_telling', 'tech_news', 'educational'].map(s => (
                        <button 
                            key={s} onClick={() => setStyle(s)}
                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                style === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={generateArticle}
                disabled={isGenerating || !selectedPost}
                className="w-full py-5 rounded-2xl bg-linear-to-r from-purple-600 to-blue-600 text-white font-black hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95"
            >
                {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                {isGenerating ? t('common.status.processing') : t('common.generate')}
            </button>
          </div>
        </div>

        {/* Right: Article Preview */}
        <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
                {article ? (
                    <motion.div 
                        key="article" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-[#050510] border border-white/10 rounded-[3rem] p-8 lg:p-16 shadow-2xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-12 flex gap-4 z-10">
                            <button 
                                onClick={() => { navigator.clipboard.writeText(article.content); setCopiedFormat('md'); setTimeout(()=>setCopiedFormat(null), 2000); }}
                                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                {copiedFormat === 'md' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                <span className="text-[10px] font-black uppercase tracking-widest">MD</span>
                            </button>
                         </div>

                         <div className="max-w-2xl mx-auto space-y-12">
                            <div className="space-y-4 text-center">
                                <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">{t('reddit.article.generator.label')}</span>
                                <h2 className="text-4xl font-black text-white leading-tight italic tracking-tighter">{article.title}</h2>
                            </div>

                            {article.digest && (
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 border-l-4 border-l-purple-500">
                                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4 italic">{t('reddit.article.generator.summary')}</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed font-medium italic">&ldquo;{article.digest}&rdquo;</p>
                                </div>
                            )}

                            <div className="prose prose-invert prose-purple max-w-none">
                                <div className="text-gray-400 leading-relaxed space-y-6 whitespace-pre-wrap font-serif text-lg">
                                    {article.content}
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black italic">α</div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{t('reddit.article.generator.engine')}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Generation complete</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 group">
                                    {t('reddit.article.generator.publish')} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ) : (
                    <div className="h-[700px] border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] flex flex-col items-center justify-center text-center p-12">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner overflow-hidden relative">
                            {isGenerating ? (
                                <div className="absolute inset-0 bg-linear-to-tr from-purple-500/20 to-blue-500/20 animate-pulse" />
                            ) : null}
                            <Layout className={`w-10 h-10 ${isGenerating ? 'text-purple-500' : 'text-gray-700'}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 italic">{t('reddit.article.generator.studio')}</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                            {isGenerating 
                                ? t('reddit.article.generator.generating')
                                : t('reddit.article.generator.studio.desc')}
                        </p>
                        
                        {!isGenerating && (
                            <div className="mt-12 grid grid-cols-3 gap-8 opacity-20">
                                <div className="flex flex-col items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Trending</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-white" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Logic</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <History className="w-5 h-5 text-white" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Output</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
}
