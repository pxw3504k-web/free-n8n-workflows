"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  ShoppingBag, 
  Loader2, 
  AlertTriangle, 
  Upload,
  Image as ImageIcon,
  Wand2,
  Download,
  Sparkles,
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/generate-product-photo';

export function ProductPhotoTool() {
  const { t } = useLanguage();
  const [roughIdea, setRoughIdea] = useState('');
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [referencePreviews, setReferencePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    image_url: string;
    layer_product?: string;
    prompt?: string;
  } | null>(null);

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);
      setProductPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(f => URL.createObjectURL(f)).slice(0, 3 - referencePreviews.length);
    setReferencePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productPreview || !roughIdea.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
        // In trial mode we convert to base64 for simplicity
        const toBase64 = (file: File) => new Promise<string>((resolve) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result as string);
            fr.readAsDataURL(file);
        });

        const imageBase64 = await toBase64(productFile!);

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roughIdea: roughIdea.trim(),
                productImage: imageBase64,
                api_key: 'trial_mode'
            })
        });

        if (!response.ok) throw new Error('Generation failed');

        const data = await response.json();
        setResult({
            image_url: data.image_url || data.output || data.result,
            layer_product: data.layer_product || data.transparent_layer,
            prompt: data.prompt
        });
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title={t('product.photo.title')} 
      description={t('product.photo.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-8">
            {/* Step 1: Product Image */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm">1</span>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('product.photo.step.image')}</h3>
                </div>
                
                <div 
                    onClick={() => document.getElementById('product-input')?.click()}
                    className={`relative border-2 border-dashed rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                        productPreview ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                >
                    {productPreview ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={productPreview} alt="Preview" className="w-full h-full object-contain p-4" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold px-4 py-2 bg-black/60 rounded-full backdrop-blur-md italic">Change Photo</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-600 mb-2" />
                            <span className="text-xs text-gray-500 font-medium">Click to upload</span>
                            <span className="text-[10px] text-gray-600 mt-1">PNG, JPG recommended</span>
                        </>
                    )}
                </div>
                <input id="product-input" type="file" className="hidden" accept="image/*" onChange={handleProductUpload} />
            </div>

            {/* Step 2: Creative Idea */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm">2</span>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('product.photo.step.vision')}</h3>
                </div>
                <textarea 
                    value={roughIdea}
                    onChange={(e) => setRoughIdea(e.target.value)}
                    placeholder="E.g. 'Luxury watch on a marble table with soft golden hour lighting...'"
                    className="w-full h-32 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-sm"
                />
            </div>

            {/* Step 3: Reference (Optional) */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 opacity-60">
                    <span className="w-8 h-8 rounded-full bg-gray-500/20 text-gray-400 flex items-center justify-center font-black text-sm">3</span>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">{t('product.photo.step.reference')}</h3>
                </div>
                <div className="flex gap-3">
                    {referencePreviews.map((url, i) => (
                        <div key={i} className="w-16 h-16 rounded-xl border border-white/10 relative group overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Ref" className="w-full h-full object-cover" />
                            <button 
                                onClick={(e) => { e.stopPropagation(); setReferencePreviews(p => p.filter((_, idx)=>idx!==i)) }}
                                className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                                <Plus className="w-4 h-4 rotate-45" />
                            </button>
                        </div>
                    ))}
                    {referencePreviews.length < 3 && (
                        <button 
                            onClick={() => document.getElementById('ref-input')?.click()}
                            className="w-16 h-16 rounded-xl border border-dashed border-white/10 hover:border-white/20 flex items-center justify-center text-gray-600 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                    <input id="ref-input" type="file" multiple className="hidden" accept="image/*" onChange={handleReferenceUpload} />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || !productPreview || !roughIdea.trim()}
                className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-emerald-600 text-white font-black hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {t('common.status.processing')}
                    </>
                ) : (
                    <>
                        <Sparkles className="w-6 h-6" />
                        {t('product.photo.button.generate')}
                    </>
                )}
            </button>
          </div>
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Right: Preview & Assets */}
        <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div 
                        key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Main Composite */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 shadow-2xl relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <a href={result.image_url} download="ai-photo.png" className="p-3 bg-black/60 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all shadow-2xl">
                                    <Download className="w-6 h-6" />
                                </a>
                             </div>
                             
                             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-blue-400" />
                                {t('product.photo.composition')}
                             </h3>
                             
                             <div className="rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 aspect-square lg:aspect-video flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={result.image_url} alt="Generated" className="w-full h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-transform duration-1000 group-hover:scale-105" />
                             </div>

                             <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                                <Link 
                                    href={{ pathname: '/tools/magic-inpainting', query: { initialImage: result.image_url } }}
                                    className="w-full sm:flex-1 py-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-black hover:shadow-[0_0_30px_rgba(219,39,119,0.4)] transition-all flex items-center justify-center gap-3 group/btn"
                                >
                                    <Wand2 className="w-6 h-6" />
                                    {t('product.photo.fine.tune')}
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-colors">
                                    Generate More
                                </button>
                             </div>
                        </div>

                        {/* Transparency Asset */}
                        {result.layer_product && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
                                     <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Layers className="w-4 h-4" />
                                        {t('product.photo.transparent')}
                                     </h4>
                                     <div 
                                        className="rounded-2xl aspect-video overflow-hidden border border-white/5 flex items-center justify-center"
                                        style={{ backgroundImage: 'repeating-conic-gradient(#1a1a2e 0% 25%, #050510 0% 50%) 50% / 20px 20px' }}
                                     >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={result.layer_product} alt="Layer" className="max-h-[80%] max-w-[80%] object-contain drop-shadow-2xl" />
                                     </div>
                                     <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/8 rounded-xl text-white text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> Download Alpha Output
                                     </button>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-center">
                                     <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Prompt Analysis</h4>
                                     <p className="text-gray-400 text-sm leading-relaxed italic">
                                        "{result.prompt || 'Our AI optimized your request for maximum realism and conversion.'}"
                                     </p>
                                     <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Tip:</p>
                                        <p className="text-xs text-emerald-400/70">Use this transparent cutout in your Photoshop designs or direct marketing materials.</p>
                                     </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="h-[600px] border-2 border-dashed border-white/10 rounded-[3rem] bg-[#050510] relative flex flex-col items-center justify-center text-center p-12 overflow-hidden shadow-inner"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
                        
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-2xl">
                                {isLoading ? (
                                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-gray-700" />
                                )}
                            </div>

                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight italic">
                                {isLoading ? 'Generating Storefront...' : 'Pro Ecommerce Photography'}
                            </h3>
                            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed text-sm">
                                {isLoading 
                                    ? 'Our neural filters are analyzing shadows and light to place your product in a perfect professional setting.'
                                    : 'Upload a simple photo of your product, and our AI will generate professional marketing assets with studio-quality environments.'}
                            </p>
                        </div>
                        
                        {!isLoading && (
                            <div className="mt-12 flex gap-4">
                                <div className="flex flex-col items-center opacity-20">
                                    <div className="w-2 h-2 rounded-full bg-white mb-2" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter italic">Upload</span>
                                </div>
                                <div className="w-12 h-[2px] bg-white/10 mt-1" />
                                <div className="flex flex-col items-center opacity-20">
                                    <div className="w-2 h-2 rounded-full bg-white mb-2" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter italic">Compose</span>
                                </div>
                                <div className="w-12 h-[2px] bg-white/10 mt-1" />
                                <div className="flex flex-col items-center opacity-20">
                                    <div className="w-2 h-2 rounded-full bg-white mb-2" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter italic">Export</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
}
