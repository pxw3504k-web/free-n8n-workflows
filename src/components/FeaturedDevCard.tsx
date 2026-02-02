"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeaturedDevCardProps {
  index?: number;
}

export function FeaturedDevCard({ index = 0 }: FeaturedDevCardProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 40px -10px rgba(59, 73, 223, 0.4)" 
      }}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#3B49DF]/30 bg-gradient-to-br from-[#1a1a2e] via-[#1e1e3a] to-[#2a2a4e] shadow-sm transition-premium hover:border-[#3B49DF]/60"
    >
      <Link
        href="https://dev.to/iloven8n/update-i-curated-500-verified-n8n-workflows-so-you-dont-have-to-debug-json-4742"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full"
      >
        {/* Top Section - DEV Logo and Badge */}
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[#0a0a1e] via-[#1a1a3e] to-[#2a2a5e]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 73, 223, 0.3) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Featured Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border bg-[#3B49DF]/20 text-[#8B9FFF] border-[#3B49DF]/40">
              <Sparkles className="w-3 h-3" />
              {language === 'zh' ? '精选' : 'Featured'}
            </span>
          </div>

          {/* External Link Icon */}
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-[#3B49DF]/20 group-hover:border-[#3B49DF]/40 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#3B49DF] transition-colors" />
            </div>
          </div>

          {/* DEV Logo - Centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 blur-2xl bg-[#3B49DF]/20 rounded-full scale-150" />
              
              {/* Logo Container */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#3B49DF]/20 to-[#6366F1]/20 border border-[#3B49DF]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 448 512" 
                  fill="currentColor" 
                  className="h-14 w-14 md:h-16 md:w-16 text-white group-hover:text-[#3B49DF] transition-colors duration-300"
                >
                  <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.85-19.59 43.9-43.8V75.8c-.05-24.21-19.69-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c.27-11.15 9.56-19.98 20.78-20.26h62.11v29.09zm56.77 123.28h-34.52V173.44h84.07v29.57h-49.56v123.28z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1e]/90 via-[#0a0a1e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Bottom Section - Quote */}
        <div className="flex flex-1 flex-col justify-between p-4">
          {/* Quote */}
          <div className="mb-3">
            <blockquote className="text-sm md:text-base font-semibold text-white leading-snug line-clamp-3">
              {language === 'zh' 
                ? '"不再调试 JSON。这位开发者精选了 500+ 个已验证的 n8n 工作流。"'
                : '"Stop debugging JSON. This dev curated 500+ verified n8n workflows."'}
            </blockquote>
          </div>

          {/* Source */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#3B49DF] to-[#6366F1] flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 448 512" 
                  fill="currentColor" 
                  className="h-3.5 w-3.5 text-white"
                >
                  <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.85-19.59 43.9-43.8V75.8c-.05-24.21-19.69-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c.27-11.15 9.56-19.98 20.78-20.26h62.11v29.09zm56.77 123.28h-34.52V173.44h84.07v29.57h-49.56v123.28z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-400">
                DEV Community
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-[#8B9FFF] group-hover:text-[#3B49DF] transition-colors">
              <span>{language === 'zh' ? '阅读文章' : 'Read Article'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

