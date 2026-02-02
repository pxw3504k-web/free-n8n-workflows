'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LeaderboardTabs } from './LeaderboardTabs';
import { WorkflowData } from '@/lib/data';

interface LeaderboardContentProps {
  risingList: WorkflowData[];
  topList: WorkflowData[];
  newList: WorkflowData[];
}

export function LeaderboardContent({ risingList, topList, newList }: LeaderboardContentProps) {
  const { t } = useLanguage();

  return (
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span>{t('leaderboard.title')}</span>
            <span className="text-5xl md:text-6xl lg:text-7xl">🏆</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            {t('leaderboard.subtitle')}
          </p>
        </div>

        {/* Leaderboard Tabs */}
        <LeaderboardTabs 
          risingList={risingList}
          topList={topList}
          newList={newList}
        />
      </div>
    </main>
  );
}

