"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Lightbulb, 
  Loader2, 
  AlertTriangle, 
  TrendingUp, 
  ExternalLink,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/smallbusiness';

interface Opportunity {
  problem_summary: string;
  business_idea: string;
  original_post: {
    content: string;
    url: string;
    upvotes: string;
    date: string;
  };
}

export function RedditBusinessOpportunityTool() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const handleStartMining = async () => {
    setIsLoading(true);
    setError(null);
    setOpportunities([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: 'trial_mode' })
      });

      if (!response.ok) throw new Error('Mining pipeline failed');

      const payload = await response.json();
      // Support both direct { opportunities: [...] } and nested { business_result: { opportunities: [...] } }
      const results = payload.opportunities || payload.business_result?.opportunities || [];
      setOpportunities(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('reddit.opportunity.title')} 
      description={t('reddit.opportunity.subtitle')}
    >
      <div className="space-y-12">
        {/* Initial Trigger Area */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full -z-10" />
             
             <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-8 mx-auto shadow-xl shadow-amber-500/20 rotate-6">
                <Lightbulb className="w-10 h-10 text-white" />
             </div>

             <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">{t('reddit.opportunity.title')}</h2>
             <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed mb-10 italic font-medium">
                {t('reddit.opportunity.subtitle')}
             </p>

             <button
                onClick={handleStartMining}
                disabled={isLoading}
                className="px-12 py-5 rounded-3xl bg-white text-black font-black hover:bg-amber-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 mx-auto"
             >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                {isLoading ? t('common.status.processing') : t('reddit.opportunity.button.start')}
             </button>

             {error && (
                <div className="mt-8 text-red-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 italic">
                    <AlertTriangle className="w-4 h-4" /> {error}
                </div>
             )}
        </div>

        {/* Opportunities List */}
        <AnimatePresence mode="wait">
            {opportunities.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {opportunities.map((opp, i) => (
                        <motion.div 
                            key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-amber-500/50 transition-all shadow-2xl flex flex-col h-full overflow-hidden"
                        >
                             <div className="flex items-center gap-3 mb-6">
                                <Target className="w-5 h-5 text-amber-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Opportunity Block {i+1}</span>
                             </div>

                             <div className="mb-8 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 border-l-4 border-l-red-500/50">
                                 <h4 className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3 italic">Verified Pain Point</h4>
                                 <p className="text-gray-300 text-sm leading-relaxed font-bold italic">&ldquo;{opp.problem_summary}&rdquo;</p>
                             </div>

                             <div className="flex-1 space-y-4 prose prose-invert prose-sm max-w-none mb-10">
                                <h4 className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-0 italic">Strategic Thesis</h4>
                                <div className="text-gray-400 font-serif text-base italic leading-relaxed">
                                    <ReactMarkdown>{opp.business_idea}</ReactMarkdown>
                                </div>
                             </div>

                             <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-[9px] font-black text-gray-600 uppercase">
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> {opp.original_post.upvotes} UPVOTES
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(opp.original_post.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => window.open(opp.original_post.url, '_blank')}
                                    className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-orange-600 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                             </div>
                             
                             {/* Decorative Background Element */}
                             <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full group-hover:bg-amber-500/10 transition-all" />
                        </motion.div>
                    ))}
                </motion.div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[1,2,3,4].map(n => (
                        <div key={n} className="h-[400px] rounded-[3rem] bg-white/5 border border-white/5 animate-pulse" />
                     ))}
                </div>
            ) : null}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}
