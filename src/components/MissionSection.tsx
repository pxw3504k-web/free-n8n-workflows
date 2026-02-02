"use client";

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function MissionSection() {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 shadow-xl text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('mission.title')}
          </h2>

          {/* Mission Statement */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            {t('mission.statement')}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

