"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 py-8 pt-32 relative z-10">
            <Link 
                href="/tools" 
                className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
            >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                {t('tools.back')}
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
                    {title}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    {description}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
