"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  FileText, 
  Loader2, 
  AlertTriangle, 
  Upload, 
  Receipt,
  Download,
  CheckCircle2,
  Calendar,
  User,
  DollarSign,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/extract-invoice';

interface ExtractedData {
  vendor_name?: string;
  invoice_number?: string;
  invoice_date?: string;
  total_amount?: number;
  tax_amount?: number;
  currency?: string;
  line_items?: Array<{
    description: string;
    quantity: number;
    amount: number;
  }>;
}

export function InvoiceExtractorTool() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractedData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', 'trial_mode');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Extraction failed');

      const data = await response.json();
      setResult(data.extracted_data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('invoice.extractor.title')} 
      description={t('invoice.extractor.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Upload Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Receipt className="w-32 h-32 rotate-12" />
             </div>

             <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                   <Upload className="w-5 h-5 text-amber-400" />
                   Document Input
                </h3>

                <div 
                    onClick={() => document.getElementById('invoice-input')?.click()}
                    className={`border-2 border-dashed rounded-[2rem] aspect-square flex flex-col items-center justify-center cursor-pointer transition-all ${
                        file ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                >
                    {file ? (
                        <div className="text-center p-8">
                            <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                            <p className="text-white font-bold truncate max-w-[200px]">{file.name}</p>
                            <p className="text-gray-500 text-xs mt-2 italic">Ready for analysis</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 mx-auto border border-white/5">
                                <Receipt className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Drop PDF or Image</p>
                            <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">limit 5MB</p>
                        </div>
                    )}
                </div>
                <input id="invoice-input" type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !file}
                    className="w-full py-5 rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 text-slate-950 font-black hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-900" /> : <CheckCircle2 className="w-6 h-6 text-slate-900" />}
                    {isLoading ? t('common.status.processing') : t('common.generate')}
                </button>
             </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs italic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Right: Extracted Intelligence */}
        <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div 
                        key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden"
                    >
                         {/* Receipt UI Styling */}
                         <div className="absolute top-0 right-0 p-8">
                             <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                             </div>
                         </div>

                         <div className="space-y-12">
                            <div className="text-center space-y-2 border-b border-dashed border-white/10 pb-8">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{result.vendor_name || 'Anonymous Merchant'}</h3>
                                <p className="text-xs text-gray-500 font-mono">Invoice #{result.invoice_number || '---'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-y-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" /> Issue Date
                                    </div>
                                    <p className="text-lg font-bold text-white italic font-mono">{result.invoice_date || 'N/A'}</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <DollarSign className="w-3 h-3" /> Net Total
                                    </div>
                                    <p className="text-3xl font-black text-white italic font-mono">{result.currency || '$'}{result.total_amount?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <Hash className="w-3 h-3" /> Tax Index
                                    </div>
                                    <p className="text-lg font-bold text-white italic font-mono">{result.currency || '$'}{result.tax_amount?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <User className="w-3 h-3" /> Entity Type
                                    </div>
                                    <p className="text-sm font-bold text-blue-400 uppercase tracking-tighter italic">B2B Commercial</p>
                                </div>
                            </div>

                            {result.line_items && result.line_items.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Line Items Breakdown</h4>
                                    <div className="space-y-3">
                                        {result.line_items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-gray-300 truncate">{item.description}</p>
                                                    <p className="text-[9px] text-gray-600 mt-1 uppercase font-black tracking-widest">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-xs font-black text-white italic font-mono ml-4">
                                                    {result.currency || '$'}{item.amount.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                         </div>

                         <div className="mt-12 flex gap-4 pt-12 border-t border-dashed border-white/10">
                             <button className="flex-1 py-4 bg-white/[0.03] hover:bg-white/5 border border-white/5 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> {t('common.download')} JSON
                            </button>
                            <button onClick={() => setResult(null)} className="px-8 py-4 bg-white/[0.03] hover:bg-red-500/10 border border-white/5 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest transition-all">
                                Reset
                            </button>
                         </div>
                    </motion.div>
                ) : (
                    <div className="h-[600px] border-2 border-dashed border-white/10 rounded-[3rem] bg-[#050510] flex flex-col items-center justify-center text-center p-12">
                         <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner relative overflow-hidden">
                            {isLoading ? (
                                <div className="absolute inset-x-0 bottom-0 bg-amber-500/20 animate-receipt-scan" />
                            ) : null}
                            <Receipt className={`w-10 h-10 ${isLoading ? 'text-amber-500' : 'text-gray-700'}`} />
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-2 italic">Awaiting document scan</h3>
                         <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                            {isLoading 
                                ? 'Applying OCR neural networks to identify semi-structured tabular data and merchant identifiers...' 
                                : 'Upload a receipt or invoice document. Our AI will automatically identify merchant details, dates, and line-item totals.'}
                         </p>
                         
                         {!isLoading && (
                            <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/5 max-w-xs mx-auto">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-2">Automated Flows</span>
                                <p className="text-[10px] text-gray-500 italic">Sync directly with QuickBooks or Xero using our n8n enterprise workflows.</p>
                            </div>
                         )}
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
        .animate-receipt-scan {
          height: 100%;
          animation: scan 2s infinite ease-in-out;
        }
      `}</style>
    </ToolLayout>
  );
}
