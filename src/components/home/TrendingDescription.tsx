"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export function TrendingDescription() {
  const { t } = useLanguage();
  
  return (
    <p className="text-sm text-gray-400">
      {t('trending.description')}
    </p>
  );
}
