"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Search, 
  Loader2, 
  MapPin, 
  Globe2, 
  Mail, 
  Phone, 
  Star, 
  Download, 
  ExternalLink,
  Users,
  Target,
  Zap,
  ChevronDown,
  Info,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/google_email_v2';

interface BusinessLead {
  id?: string;
  companyName: string;
  email: string[];
  phone?: string;
  website?: string;
  address?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  leadScore?: number;
  tags?: string[];
  status?: string;
}

export function BusinessLeadsTool() {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState('Dentist');
  const [city, setCity] = useState('San Francisco');
  const [maxResults, setMaxResults] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<BusinessLead[]>([]);

  const industryPresets = [
    { label: 'Dentist', value: 'Dentist' },
    { label: 'Contractor', value: 'Contractor' },
    { label: 'Gym', value: 'Gym' },
    { label: 'Law Firm', value: 'Law firm' },
    { label: 'Logistics', value: 'Logistics company' }
  ];

  const cityPresets = [
    { label: 'SF', value: 'San Francisco' },
    { label: 'NY', value: 'New York' },
    { label: 'London', value: 'London' },
    { label: 'Sydney', value: 'Sydney' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !city.trim()) return;

    setIsLoading(true);
    setError(null);
    setLeads([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            search_term: keyword.trim(),
            location_text: city.trim(),
            max_results: maxResults,
            api_key: 'trial_mode'
        })
      });

      if (!response.ok) throw new Error('V2 Mining protocol failed');

      const payload = await response.json();
      // Support both nested structure { data: { business_result: [...] } } and direct array
      const results = Array.isArray(payload) ? payload : (payload.data?.business_result || []);
      
      if (results.length === 0) {
        setError('No active leads detected for this segment.');
      } else {
        // Map new API response format to internal BusinessLead interface
        const mappedResults: BusinessLead[] = results.map((item: any) => ({
          ...item,
          companyName: item.businessName || item.companyName, // Fallback to old field
          email: item.emails || item.email || [], // Handle new array field 'emails'
          tags: item.primaryType ? [item.primaryType] : (item.tags || []),
          status: item.businessStatus || item.status
        }));
        setLeads(mappedResults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scraping error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!leads.length) return;
    const header = "Company Name,Primary Email,All Emails,Phone,Website,Rating,Lead Score,Tags\n";
    const rows = leads.map(l => {
        const emails = l.email || [];
        return `"${l.companyName}","${emails[0] || ''}","${emails.join(';') || ''}","${l.phone || ''}","${l.website || ''}",${l.rating || ''},${l.leadScore || ''},"${(l.tags || []).join('|')}"`;
    }).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-leads-${city}-${keyword}.csv`;
    link.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-400';
    return 'bg-red-500';
  };

  return (
    <ToolLayout 
      title={t('b2b.leads.title')} 
      description={t('b2b.leads.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Search Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-24 h-24 text-blue-500" />
             </div>

             <div className="space-y-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs italic">01</span>
                        <h4 className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{t('b2b.leads.input.industry')}</h4>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            value={keyword} onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {industryPresets.map(p => (
                            <button key={p.value} onClick={() => setKeyword(p.value)} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">{p.label}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs italic">02</span>
                        <h4 className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{t('b2b.leads.input.location')}</h4>
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            value={city} onChange={(e) => setCity(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {cityPresets.map(p => (
                            <button key={p.value} onClick={() => setCity(p.value)} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">{p.label}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs italic">03</span>
                            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{t('b2b.leads.input.limit')}</h4>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 font-mono tracking-tighter">MAX {maxResults}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[5, 10, 20].map(val => (
                            <button 
                                key={val}
                                onClick={() => setMaxResults(val)}
                                className={`py-3 rounded-xl text-[10px] font-black transition-all border ${
                                    maxResults === val ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                {val} LEADS
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !keyword.trim() || !city.trim()}
                    className="w-full py-5 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                    {isLoading ? t('b2b.leads.status.mining') : t('b2b.leads.button.start')}
                </button>

                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                    <p className="text-[10px] text-blue-300/60 leading-relaxed uppercase font-medium italic">V2 Protocol: Enhanced with lead quality scoring and multi-email extraction logic.</p>
                </div>
             </div>
          </div>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs italic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Right: Results Table */}
        <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
                {leads.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-bold text-white uppercase italic tracking-tighter">{t('b2b.leads.results.entities')} <span className="ml-2 text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">{leads.length} units</span></h3>
                            </div>
                            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">
                                <Download className="w-4 h-4" /> {t('common.download')} CSV
                            </button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('b2b.leads.table.context')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('b2b.leads.table.contacts')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('b2b.leads.table.maturity')}</th>
                                            <th className="px-8 py-5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {leads.map((lead, i) => (
                                            <motion.tr 
                                                key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-all"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="text-white font-bold tracking-tight">{lead.companyName}</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(lead.tags || []).slice(0, 3).map(tag => (
                                                                <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] text-gray-500 font-black uppercase tracking-tighter">{tag}</span>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                                                            <MapPin className="w-3 h-3" />
                                                            <span className="truncate max-w-[150px]">{lead.address || 'Hashed Location'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-2">
                                                        {lead.email && lead.email.length > 0 ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                                                    <Mail className="w-3 h-3 text-emerald-400" />
                                                                    <span className="text-[11px] font-black text-emerald-400">{lead.email[0]}</span>
                                                                </div>
                                                                {lead.email.length > 1 && (
                                                                    <span className="text-[9px] text-gray-600 font-black uppercase ml-1">+{lead.email.length - 1} More Contacts</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-[9px] font-black text-gray-700 uppercase italic">Email Obfuscated</div>
                                                        )}
                                                        {lead.phone && (
                                                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono italic">
                                                                <Phone className="w-3 h-3" /> {lead.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-2 max-w-[120px]">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('b2b.leads.quality')}</span>
                                                            <span className="text-[10px] font-black text-white italic">{lead.leadScore || 0}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }} animate={{ width: `${lead.leadScore || 0}%` }}
                                                                className={`h-full rounded-full ${getScoreColor(lead.leadScore || 0)}`} 
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className={`w-3 h-3 ${lead.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-800'}`} />
                                                            <span className="text-[10px] font-bold text-gray-400">{lead.rating?.toFixed(1) || '0.0'} <span className="text-gray-700 font-medium italic">({lead.reviews || 0})</span></span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => lead.website && window.open(lead.website, '_blank')}
                                                        className={`p-3 rounded-2xl transition-all ${lead.website ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 shadow-lg' : 'bg-white/5 text-gray-800 cursor-not-allowed border border-white/5'}`}
                                                    >
                                                        <Globe2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-[600px] border-2 border-dashed border-white/10 rounded-[3rem] bg-[#050510] flex flex-col items-center justify-center text-center p-12">
                         <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner overflow-hidden relative">
                            {isLoading ? (
                                <div className="absolute inset-0 bg-linear-to-b from-blue-500/20 to-transparent animate-pulse" />
                            ) : null}
                            {isLoading ? <Loader2 className="w-10 h-10 text-blue-500 animate-spin" /> : <Users className="w-10 h-10 text-gray-800" />}
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-2 italic">Extraction Pipeline V2</h3>
                         <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                            {isLoading 
                                ? 'Parsing global verified datasets and reconciling contact nodes. We are applying neural confidence scoring to every lead hit.' 
                                : 'Configure your target industrial sector and regional node. Our updated pipeline will extract verified B2B contacts with maturity indexing.'}
                         </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
}
