"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToolLayout } from './ToolLayout';
import { 
  Image as ImageIcon, 
  Loader2, 
  AlertTriangle, 
  Upload,
  Wand2,
  Download,
  Trash2,
  Undo2,
  Maximize2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://n8nwori.zeabur.app/webhook/edit-image-inpainting';

export function MagicInpaintingTool() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(48);
  const [scale, setScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [compareValue, setCompareValue] = useState(50);
  const [showComparison, setShowComparison] = useState(false);

  // History for undo
  const [strokes, setStrokes] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [currentStroke, setCurrentStroke] = useState<Array<{ x: number; y: number }>>([]);

  // Initialization & Resizing
  const initCanvases = (img: HTMLImageElement) => {
    const base = baseCanvasRef.current!;
    const draw = drawCanvasRef.current!;
    const mask = maskCanvasRef.current!;
    
    // Set internal resolution to match image
    [base, draw, mask].forEach(c => {
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
    });

    const bctx = base.getContext('2d')!;
    const mctx = mask.getContext('2d')!;
    
    bctx.drawImage(img, 0, 0);
    
    // Initialize black mask
    mctx.fillStyle = 'black';
    mctx.fillRect(0, 0, mask.width, mask.height);
    
    setImageLoaded(true);
    resetView();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            setOriginalUrl(event.target?.result as string);
            initCanvases(img);
        };
        img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetView = () => {
    setScale(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  // Drawing Logic
  const getPointerPos = (e: React.PointerEvent | PointerEvent) => {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
        if (isSpaceDown) return;
        setIsDrawing(true);
        const p = getPointerPos(e);
        setCurrentStroke([{ x: p.x, y: p.y }]);
    };

    const onPointerMove = (e: PointerEvent) => {
        const p = getPointerPos(e);
        setCursorPos(p);
        if (!isDrawing) return;
        setCurrentStroke(prev => [...prev, p]);
    };

    const onPointerUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setStrokes(prev => [...prev, currentStroke]);
        setCurrentStroke([]);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDrawing, currentStroke, isSpaceDown]);

  // Render Loop for Drawing
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    const mask = maskCanvasRef.current;
    if (!canvas || !mask) return;

    const ctx = canvas.getContext('2d')!;
    const mctx = mask.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mctx.fillStyle = 'black';
    mctx.fillRect(0, 0, mask.width, mask.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    
    mctx.lineCap = 'round';
    mctx.lineJoin = 'round';
    mctx.strokeStyle = 'white';

    const drawLine = (c: CanvasRenderingContext2D, s: Array<{x: number, y: number}>) => {
        if (s.length < 2) return;
        c.beginPath();
        c.lineWidth = brushSize;
        c.moveTo(s[0].x, s[0].y);
        for(let i=1; i<s.length; i++) c.lineTo(s[i].x, s[i].y);
        c.stroke();
    };

    strokes.forEach(s => {
        drawLine(ctx, s);
        drawLine(mctx, s);
    });
    if (currentStroke.length > 0) {
        drawLine(ctx, currentStroke);
        drawLine(mctx, currentStroke);
    }
  }, [strokes, currentStroke, brushSize]);

  // Global Key Listeners for Space/Pan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            setIsSpaceDown(true);
            if (e.type === 'keydown') e.preventDefault();
        }
        if (e.key === '[') setBrushSize(b => Math.max(5, b - 5));
        if (e.key === ']') setBrushSize(b => Math.min(200, b + 5));
    };
    const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') setIsSpaceDown(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const handleGenerate = async () => {
    if (!imageLoaded || !prompt.trim()) return;
    
    setIsLoading(true);
    setLoadingText('Preparing export...');

    try {
        // Convert canvases to blobs
        const baseBlob = await new Promise<Blob>((resolve) => baseCanvasRef.current!.toBlob(b => resolve(b!), 'image/png'));
        const maskBlob = await new Promise<Blob>((resolve) => maskCanvasRef.current!.toBlob(b => resolve(b!), 'image/png'));

        setLoadingText('Analyzing strokes...');
        
        // In a real scenario we'd upload to GCS. Here we mock/use temporary base64 for trial
        // Assuming we send base64 to the webhook for simplicity in the trial version
        const reader = (b: Blob) => new Promise<string>((resolve) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result as string);
            fr.readAsDataURL(b);
        });

        const base64Base = await reader(baseBlob);
        const base64Mask = await reader(maskBlob);

        setLoadingText('AI is rebuilding your image...');

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: base64Base,
                mask: base64Mask,
                prompt: prompt.trim(),
                api_key: 'trial_mode'
            })
        });

        if (!response.ok) throw new Error('AI processing failed');

        const data = await response.json();
        setResultUrl(data.image_url || data.output || data.result);
        setShowComparison(true);
    } catch (err) {
        alert(err instanceof Error ? err.message : 'Processing failed');
    } finally {
        setIsLoading(false);
        setLoadingText('');
    }
  };

  return (
    <ToolLayout 
      title={t('magic.inpainting.title')} 
      description={t('magic.inpainting.description')}
    >
        <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
            {/* Main Canvas Area */}
            <div className="flex-1 bg-[#0a0a1a] rounded-[2rem] border border-white/10 relative overflow-hidden group">
                <div 
                    className="absolute inset-0 cursor-crosshair"
                    onWheel={(e) => {
                        const delta = e.deltaY > 0 ? 0.9 : 1.1;
                        setScale(s => Math.max(0.1, Math.min(5, s * delta)));
                    }}
                    onMouseDown={(e) => {
                        if (isSpaceDown || e.button === 1) {
                            setIsDragging(true);
                            setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
                        }
                    }}
                    onMouseMove={(e) => {
                        if (isDragging) {
                            setCanvasOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                        }
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                >
                    <div 
                        className="relative transition-transform duration-75"
                        style={{
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
                            transformOrigin: 'center'
                        }}
                    >
                        <canvas ref={baseCanvasRef} className="block shadow-2xl" />
                        <canvas ref={drawCanvasRef} className="absolute inset-0 z-10 opacity-70" />
                        <canvas ref={maskCanvasRef} className="hidden" />

                        {/* Custom Brush Cursor */}
                        {!isDragging && (
                            <div 
                                className="absolute pointer-events-none border border-white/80 rounded-full bg-white/10 z-20"
                                style={{
                                    left: cursorPos.x,
                                    top: cursorPos.y,
                                    width: brushSize,
                                    height: brushSize,
                                    marginLeft: -brushSize/2,
                                    marginTop: -brushSize/2
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Floating Toolbar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl z-30 shadow-2xl">
                    <div className="flex items-center gap-1 px-3 border-r border-white/10 mr-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2">{t('magic.inpainting.brush')}</span>
                        <input 
                            type="range" min="5" max="200" value={brushSize} 
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-24 accent-blue-500"
                        />
                    </div>
                    <button onClick={() => setStrokes(s => s.slice(0, -1))} className="p-2 hover:bg-white/10 rounded-xl text-gray-300 transition-colors" title={t('magic.inpainting.undo')}><Undo2 className="w-5 h-5"/></button>
                    <button onClick={() => setStrokes([])} className="p-2 hover:bg-red-500/20 rounded-xl text-gray-300 hover:text-red-400 transition-colors" title={t('magic.inpainting.clear')}><Trash2 className="w-5 h-5"/></button>
                    <div className="w-[1px] h-6 bg-white/10 mx-1" />
                    <button onClick={resetView} className="p-2 hover:bg-white/10 rounded-xl text-gray-300 transition-colors" title={t('common.status.ready')}><Maximize2 className="w-5 h-5"/></button>
                </div>

                {/* Comparison UI */}
                <AnimatePresence>
                    {showComparison && resultUrl && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 z-50 flex flex-col p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ImageIcon className="w-6 h-6 text-green-400" />
                                    {t('common.results')}
                                </h3>
                                <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400"><X /></button>
                            </div>
                            
                            <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 group bg-grid-white/5">
                                 {/* Simple Slider Implementation */}
                                 <div className="absolute inset-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={resultUrl} alt="Result" className="w-full h-full object-contain" />
                                    <div 
                                        className="absolute inset-0 border-r-2 border-white pointer-events-none"
                                        style={{ width: `${compareValue}%`, overflow: 'hidden' }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={originalUrl!} alt="Original" className="w-full h-full object-contain filter grayscale" style={{ width: `${10000/compareValue}%` }} />
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" value={compareValue}
                                        onChange={(e) => setCompareValue(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                                    />
                                    
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase">{t('common.original')}</div>
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase">{t('common.results')}</div>
                                 </div>
                            </div>
                            
                            <div className="mt-8 flex justify-center gap-4">
                                <a href={resultUrl} download="inpainted.png" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                                    <Download className="w-5 h-5"/> Download
                                </a>
                                <button onClick={() => setShowComparison(false)} className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold shadow-xl hover:shadow-blue-500/20 transition-all">
                                    Keep Drawing
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!imageLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                         <div className="w-20 h-20 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center mb-6">
                            <Upload className="w-8 h-8 text-white/30" />
                         </div>
                         <h4 className="text-xl font-bold text-white mb-2 underline cursor-pointer pointer-events-auto" onClick={() => fileInputRef.current?.click()}>Upload Image</h4>
                         <p className="text-gray-500 text-sm">Select a high-quality photo to start inpainting.</p>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                )}
            </div>

            {/* Sidebar Controls */}
            <div className="w-full lg:w-96 space-y-6">
                 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Magic Instructions</h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Object</label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe what should be here... (e.g. 'a red sports car', 'a golden retriever')"
                                className="w-full h-32 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                            />
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                             <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                                <AlertTriangle className="w-4 h-4"/> How to use:
                             </div>
                             <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
                                <li>• Paint over the object you want to change.</li>
                                <li>• Zoom with mouse wheel, Pan with Space + Drag.</li>
                                <li>• Describe the replacement above.</li>
                             </ul>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !imageLoaded || !prompt.trim()}
                            className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    {loadingText || 'Processing...'}
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-6 h-6" />
                                    Invoke Magic
                                </>
                            )}
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    </ToolLayout>
  );
}
