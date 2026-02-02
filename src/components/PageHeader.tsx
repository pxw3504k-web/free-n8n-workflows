"use client";

import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  showing: number;
  total: number;
}

export function PageHeader({ showing, total }: PageHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">{t('home.latestWorkflows')}</h2>
      <span className="text-sm text-gray-400">
        {t('home.showing')} {showing} {t('home.of')} {total}
      </span>
    </div>
  );
}

