"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
}

export function ToolCard({ title, description, icon: Icon, slug }: ToolCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col h-full hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 flex-1">{description}</p>
      <Link 
        href={`/tools/${slug}`}
        className="inline-flex items-center text-blue-400 font-medium hover:gap-2 transition-all"
      >
        {t('tools.tryNow')}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </motion.div>
  );
}
