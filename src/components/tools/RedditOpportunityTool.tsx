"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Lightbulb, 
  Loader2, 
  AlertTriangle, 
  MessageSquare, 
  Zap,
  ExternalLink
} from 'lucide-react';

const API_ENDPOINT = 'https://n8n.opalyun.com/webhook/reddit-opportunities';

interface Opportunity {
  pain_point: string;
  business_idea: string;
  reddit_url: string;
}

export function RedditOpportunityTool() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    setOpportunities([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'start'
        })
      });

      if (!response.ok) {
        throw new Error(t('reddit.opportunity.subtitle'));
      }

      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('reddit.opportunity.subtitle'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('reddit.opportunity.title')} 
      description={t('reddit.opportunity.subtitle')}
    >
      <div className="space-y-8">
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="px-12 py-4 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-black text-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {t('reddit.opportunity.mining')}
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 fill-white" />
                {t('reddit.opportunity.start')}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {opportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {opportunities.map((opp, i) => (
              <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4 hover:border-blue-500/30 transition-colors group">
                <div>
                  <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    {t('reddit.opportunity.pain.point')}
                  </h4>
                  <p className="text-white text-sm leading-relaxed">
                    {opp.pain_point}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Lightbulb className="w-3 h-3" />
                    {t('reddit.opportunity.idea')}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    {opp.business_idea}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={opp.reddit_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-xs"
                  >
                    View Source
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {opportunities.length === 0 && !isLoading && !error && (
            <div className="py-20 text-center space-y-4 opacity-50">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-600" />
                <p className="text-gray-400">Click the button above to start mining Reddit for business opportunities.</p>
            </div>
        )}
      </div>
    </ToolLayout>
  );
}
