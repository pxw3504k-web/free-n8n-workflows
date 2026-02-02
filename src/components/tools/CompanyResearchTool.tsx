"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Building2, 
  Loader2, 
  AlertTriangle, 
  Search,
  Globe,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  ExternalLink,
  CreditCard,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/company-research';

interface CompanyResult {
  company: string;
  domain?: string;
  market?: string;
  cheapest_plan?: number;
  has_API?: boolean;
  has_free_trial?: boolean;
  has_enterprise_plan?: boolean;
  integrations?: string[];
  linkedinUrl?: string;
  case_study_link?: string;
}

export function CompanyResearchTool() {
  const { t } = useLanguage();
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompanyResult | null>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: company.trim(), api_key: 'trial_mode' })
      });

      if (!response.ok) throw new Error('Research protocol failed');

      const data = await response.json();
      setResult(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('company.research.title')} 
      description={t('company.research.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="w-24 h-24 rotate-12" />
             </div>

             <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <Target className="w-5 h-5 text-blue-400" />
                   {t('company.research.entity')}
                </h3>

                <form onSubmit={handleResearch} className="space-y-4">
                    <div className="relative group">
                        <input 
                            value={company} onChange={(e) => setCompany(e.target.value)}
                            placeholder="E.g. 'Apple', 'n8n', 'OpenAI'..."
                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white italic font-bold focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !company.trim()}
                        className="w-full py-5 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 text-white font-black hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                        {isLoading ? t('common.status.processing') : t('common.generate')}
                    </button>
                </form>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 italic">{t('company.research.scope')}:</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed uppercase">Direct domain crawl, social profiling, and technical signal mapping via LLM clusters.</p>
                </div>
             </div>
          </div>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs italic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Right Intelligence Area */}
        <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div 
                        key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Core Data Dash */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-center gap-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('company.research.market')}</span>
                                <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black w-fit italic uppercase">
                                    {result.market || 'Unknown'}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-center gap-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('company.research.domain')}</span>
                                <button 
                                    onClick={() => result.domain && window.open(`https://${result.domain}`, '_blank')}
                                    className="flex items-center gap-2 text-white font-bold text-sm hover:text-blue-400 transition-colors italic w-fit"
                                >
                                    <Globe className="w-4 h-4" /> {result.domain || 'N/A'} <ExternalLink className="w-3 h-3 opacity-50" />
                                </button>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-center gap-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('company.research.cost')}</span>
                                <div className="flex items-center gap-2 text-xl font-black text-white italic">
                                    <CreditCard className="w-4 h-4 text-emerald-500" />
                                    {result.cheapest_plan === 0 ? 'Freemium' : result.cheapest_plan ? `$${result.cheapest_plan}/mo` : 'Contact Sales'}
                                </div>
                            </div>
                        </div>

                        {/* Feature verification */}
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                             <div className="flex items-center gap-3 mb-10">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <h3 className="text-lg font-bold text-white uppercase tracking-tighter italic">{t('company.research.verified')}</h3>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: 'Public API', val: result.has_API },
                                    { label: 'Free Trial', val: result.has_free_trial },
                                    { label: 'Enterprise Layer', val: result.has_enterprise_plan }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-black/40 border border-white/5 group">
                                        {item.val ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500/50" />}
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white uppercase tracking-tight">{item.label}</span>
                                            <span className={`text-[9px] font-black uppercase ${item.val ? 'text-emerald-500' : 'text-gray-600'}`}>{item.val ? t('common.status.ready') : t('common.original')}</span>
                                        </div>
                                    </div>
                                ))}
                             </div>

                             {result.integrations && result.integrations.length > 0 && (
                                <div className="mt-12 space-y-6">
                                     <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Ecosystem Nodes</h4>
                                     <div className="flex flex-wrap gap-2">
                                        {result.integrations.map((n, i) => (
                                            <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:text-white hover:border-blue-500/30 transition-all">{n}</span>
                                        ))}
                                     </div>
                                </div>
                             )}
                        </div>

                        {/* Action Nodes */}
                        <div className="flex gap-4">
                            {result.linkedinUrl && (
                                <button 
                                    onClick={() => window.open(result.linkedinUrl, '_blank')}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" /> LinkedIn HQ
                                </button>
                            )}
                            {result.case_study_link && (
                                <button 
                                    onClick={() => window.open(result.case_study_link, '_blank')}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:border-purple-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" /> Case Study
                                </button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-[600px] border-2 border-dashed border-white/10 rounded-[3rem] bg-[#050510] flex flex-col items-center justify-center text-center p-12">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner overflow-hidden relative">
                            {isLoading ? (
                                <div className="absolute inset-0 bg-linear-to-b from-blue-500/20 to-transparent animate-pulse" />
                            ) : null}
                            <Building2 className={`w-10 h-10 ${isLoading ? 'text-blue-500' : 'text-gray-700'}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 italic">Intelligence Protocol Idle</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                            {isLoading 
                                ? 'Parsing competitor datasets and mapping technical ecosystem integrators in real-time...' 
                                : 'Input a company name or domain to generate a comprehensive technical research audit and market positioning report.'}
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
}
