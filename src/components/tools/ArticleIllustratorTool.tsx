"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  PenTool, 
  Loader2, 
  AlertTriangle, 
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  Wand2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/generate-illustration';

interface IllustrationScene {
  narrator: string;
  dialogue: string;
  description: string;
  image_base64: string;
}

export function ArticleIllustratorTool() {
  const { t } = useLanguage();
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('Digital Art');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenes, setScenes] = useState<IllustrationScene[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError(t('article.illustrator.input'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setScenes([]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            article_text: content.trim(),
            style,
            api_key: "trial_key" // Simplified for trial mode
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Generation failed');
      }

      const data = await response.json();
      
      // Adaptation logic for different response formats
      let parsedScenes: IllustrationScene[] = [];
      if (Array.isArray(data)) {
        parsedScenes = data;
      } else if (data.data && Array.isArray(data.data)) {
        parsedScenes = data.data;
      } else if (data.scenes && Array.isArray(data.scenes)) {
        parsedScenes = data.scenes;
      } else if (data.business_result && Array.isArray(data.business_result)) {
        parsedScenes = data.business_result;
      }

      if (parsedScenes.length === 0) {
        throw new Error('No scenes generated. Please try again with more detailed content.');
      }

      setScenes(parsedScenes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScene = async (index: number) => {
    const scene = scenes[index];
    if (!scene) return;

    const textToCopy = `Narrator: ${scene.narrator}\nDialogue: ${scene.dialogue}\nDescription: ${scene.description}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadImage = (index: number) => {
    const scene = scenes[index];
    if (!scene || !scene.image_base64) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${scene.image_base64}`;
    link.download = `scene-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ToolLayout 
      title={t('article.illustrator.title')} 
      description={t('article.illustrator.description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <PenTool className="w-20 h-20 rotate-12" />
             </div>
             
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                {t('article.illustrator.input')}
             </h3>
             
             <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your article or story here... (min 50 chars recommended)"
                    className="w-full h-80 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none font-sans leading-relaxed"
                />

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Illustration Style</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Digital Art', 'Cinematic', 'Comic Book', 'Watercolor'].map(s => (
                            <button 
                                key={s}
                                type="button" 
                                onClick={() => setStyle(s)}
                                className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                                    style === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading || !content.trim()}
                    className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {t('common.status.processing')}
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-6 h-6" />
                            {t('article.illustrator.generate')}
                        </>
                    )}
                </button>
             </form>

             {error && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3"
                >
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                </motion.div>
             )}
          </div>
        </div>

        {/* Right: Results Dashboard */}
        <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
                {scenes.length > 0 ? (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <ImageIcon className="w-6 h-6 text-blue-400" />
                                {t('article.illustrator.preview')}
                                <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs text-medium">
                                    {t('article.illustrator.scenes.count', { count: scenes.length.toString() })}
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {scenes.map((scene, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group relative"
                                >
                                    {/* Number Badge */}
                                    <div className="absolute -left-4 -top-4 w-12 h-12 rounded-2xl bg-[#050510] border border-white/10 flex items-center justify-center text-white font-black z-20 shadow-2xl group-hover:scale-110 group-hover:border-blue-500/50 transition-all">
                                        {i + 1}
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl hover:border-white/20 transition-all">
                                        {/* Image Section */}
                                        <div className="md:w-1/2 aspect-video md:aspect-auto relative bg-black/40 min-h-[300px]">
                                            {scene.image_base64 ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img 
                                                    src={`data:image/png;base64,${scene.image_base64}`}
                                                    alt={`Scene ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                                                    <ImageIcon className="w-16 h-16 opacity-10 mb-4" />
                                                    <span className="text-sm font-medium opacity-20">Rendering image...</span>
                                                </div>
                                            )}
                                            
                                            {/* Action Toggles overlay */}
                                            <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                                 <button 
                                                    onClick={() => handleDownloadImage(i)}
                                                    className="flex-1 py-2 bg-black/60 shadow-lg backdrop-blur-md rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"
                                                 >
                                                    <Download className="w-4 h-4" />
                                                    Download PNG
                                                 </button>
                                                 <button 
                                                    onClick={() => handleCopyScene(i)}
                                                    className="w-12 h-10 bg-black/60 shadow-lg backdrop-blur-md rounded-xl text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                                                 >
                                                    {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                 </button>
                                            </div>
                                        </div>

                                        {/* Meta Section */}
                                        <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-6">
                                            {scene.narrator && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        <div className="w-4 h-[1px] bg-blue-400/50" />
                                                        Narrator
                                                    </div>
                                                    <p className="text-white text-lg font-medium leading-relaxed">{scene.narrator}</p>
                                                </div>
                                            )}
                                            
                                            {scene.dialogue && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        <div className="w-4 h-[1px] bg-purple-400/50" />
                                                        Dialogue
                                                    </div>
                                                    <p className="text-gray-300 italic text-base leading-relaxed bg-white/5 p-4 rounded-xl border-l-2 border-purple-500/50">
                                                       "{scene.dialogue}"
                                                    </p>
                                                </div>
                                            )}

                                            <div className="pt-4 border-t border-white/5">
                                                <p className="text-gray-500 text-xs italic line-clamp-3 hover:line-clamp-none transition-all cursor-default">
                                                    {scene.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-[600px] bg-white/5 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 overflow-hidden relative"
                    >
                         <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-blue-500/10 blur-[120px] rounded-full" />
                            <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-purple-500/10 blur-[120px] rounded-full" />
                         </div>

                         <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                            {isLoading ? (
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            ) : (
                                <ImageIcon className="w-10 h-10 text-gray-600" />
                            )}
                         </div>

                         <h3 className="text-2xl font-bold text-white mb-4">
                            {isLoading ? t('common.status.processing') : t('common.results')}
                         </h3>
                         <p className="text-gray-500 max-w-sm leading-relaxed">
                            {isLoading 
                                ? t('common.status.processing')
                                : t('article.illustrator.preview')}
                         </p>

                         {!isLoading && (
                            <div className="mt-12 flex items-center gap-6 opacity-20">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-[2px] bg-white/20" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Outline</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white" />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-[2px] bg-white/20" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Storyboard</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white" />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-[2px] bg-white/20" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Visuals</span>
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
