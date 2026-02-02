"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  FileText, 
  Loader2, 
  AlertTriangle, 
  Search,
  Copy,
  PenTool
} from 'lucide-react';

const API_ENDPOINT = 'https://n8n.opalyun.com/webhook/reddit-article-generator';

export function RedditArticleTool() {
  const { t } = useLanguage();
  const [subreddit, setSubreddit] = useState('');
  const [style, setStyle] = useState('tech-news');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subreddit.trim()) return;

    setIsLoading(true);
    setError(null);
    setArticle(null);

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subreddit: subreddit.trim(),
                style
            })
        });

        if (!response.ok) throw new Error('Generation failed');

        const data = await response.json();
        setArticle(data.article);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('reddit.article.title')} 
      description={t('reddit.article.description')}
    >
      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Subreddit (e.g. artificial)"
                    value={subreddit}
                    onChange={(e) => setSubreddit(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1e] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                    <option value="tech-news">Tech News</option>
                    <option value="story-telling">Story Telling</option>
                    <option value="product-review">Product Review</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isLoading || !subreddit.trim()}
                className="w-full py-4 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Article'}
            </button>
        </form>

        {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                {error}
            </div>
        )}

        {article && (
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative group">
                <button 
                    onClick={() => navigator.clipboard.writeText(article)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Copy Markdown"
                >
                    <Copy className="w-4 h-4" />
                </button>
                <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed">
                        {article}
                    </pre>
                </div>
            </div>
        )}
      </div>
    </ToolLayout>
  );
}
