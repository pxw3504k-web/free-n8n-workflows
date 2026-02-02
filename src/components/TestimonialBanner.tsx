"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function TestimonialBanner() {
  const { language } = useLanguage();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="https://dev.to/iloven8n/update-i-curated-500-verified-n8n-workflows-so-you-dont-have-to-debug-json-4742"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="max-w-5xl mx-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Left: DEV Logo */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 448 512" 
                      fill="currentColor" 
                      className="h-12 w-12 md:h-14 md:w-14 text-white group-hover:text-[#3B49DF] transition-colors duration-300"
                    >
                      <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.85-19.59 43.9-43.8V75.8c-.05-24.21-19.69-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c.27-11.15 9.56-19.98 20.78-20.26h62.11v29.09zm56.77 123.28h-34.52V173.44h84.07v29.57h-49.56v123.28z"/>
                    </svg>
                  </div>
                </div>

                {/* Right: Quote and CTA */}
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="mb-4">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                      {language === 'zh' 
                        ? '"不再调试 JSON。这位开发者精选了 500+ 个已验证的 n8n 工作流。"'
                        : '"Stop debugging JSON. This dev curated 500+ verified n8n workflows."'}
                    </p>
                  </blockquote>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 448 512" 
                          fill="currentColor" 
                          className="h-4 w-4 text-white"
                        >
                          <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.85-19.59 43.9-43.8V75.8c-.05-24.21-19.69-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c.27-11.15 9.56-19.98 20.78-20.26h62.11v29.09zm56.77 123.28h-34.52V173.44h84.07v29.57h-49.56v123.28z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        DEV Community
                      </span>
                    </div>
                    
                    <span className="hidden sm:inline text-gray-500">•</span>
                    
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
                      <span>{language === 'zh' ? '在 DEV 上阅读' : 'Read on DEV'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

