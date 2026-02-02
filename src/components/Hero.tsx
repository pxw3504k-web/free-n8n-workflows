"use client";

import Link from 'next/link';
import { motion, Transition } from 'framer-motion';
import { SparkleTitle } from './SparkleTitle';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from './SearchBar';
import { IdentityBar } from './IdentityBar';

export function Hero() {
  const { language } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // 从 0.1 减少到 0.05
        delayChildren: 0.1, // 从 0.3 减少到 0.1
      },
    },
  };

  const transition: Transition = { type: "spring", stiffness: 80, damping: 15 }; // 加快弹簧动画

  const item = {
    hidden: { opacity: 0, y: 10 }, // 从 20 减少到 10
    show: { 
      opacity: 1, 
      y: 0, 
      transition
    },
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-70" />

      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12 text-center max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Social Proof Pill - Featured on DEV Community */}
          <motion.div 
            variants={item}
            className="flex justify-center mb-6"
          >
            <Link 
              href="https://x.com/ThePracticalDev/status/2006789018202017934"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-indigo-200">
                {language === 'zh' ? '精选于 DEV Community' : 'Featured on DEV Community'}
              </span>
              <svg 
                className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <SparkleTitle />
          </motion.div>
          <motion.p 
            className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={item}
          >
            {language === 'zh' 
              ? '浏览数百个社区贡献的工作流，自动化您的任务。将您喜爱的应用和服务与 n8n 连接。'
              : 'Browse hundreds of community-contributed workflows to automate your tasks. Connect your favorite apps and services with n8n.'}
          </motion.p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* Large search entry in hero */}
          <div className="mb-8">
            <SearchBar />
          </div>
          {/* Identity Bar */}
          <div className="mb-8">
            <IdentityBar />
          </div>
          {/* Top categories removed per request */}
        </motion.div>
      </div>
    </section>
  );
}
