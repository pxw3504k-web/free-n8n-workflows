"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Flame, 
  Loader2, 
  AlertTriangle, 
  ArrowUp,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

const API_ENDPOINT = 'https://n8n.opalyun.com/webhook/product-hunt-daily';

interface Product {
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  commentsCount: number;
  thumbnail: string;
}

export function ProductHuntTool() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const handleFetch = async () => {
    setIsLoading(true);
    setError(null);
    setProducts([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch' })
      });

      if (!response.ok) throw new Error('Fetch failed');

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
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
        <div className="flex justify-center">
            <button
                onClick={handleFetch}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-linear-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        <Flame className="w-5 h-5" />
                        Get Today's Top Products
                    </>
                )}
            </button>
        </div>

        {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                {error}
            </div>
        )}

        {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {products.map((product, i) => (
                    <a 
                        key={i}
                        href={product.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all group flex gap-4"
                    >
                        <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate group-hover:text-orange-400 transition-colors">
                                {product.name}
                            </h4>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                                {product.tagline}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <ArrowUp className="w-3 h-3" />
                                    {product.votesCount}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {product.commentsCount}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        )}
      </div>
    </ToolLayout>
  );
}
