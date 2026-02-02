'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { REFERRAL_LINKS } from '@/lib/constants';

export function DeployOptions() {
  const { t } = useLanguage();

  return (
    <div className="border-l-4 border-blue-500 bg-slate-800/50 p-6 my-6 rounded-r-lg">
      {/* Heading */}
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">🚀</span>
        {t('monetization.detail.title')}
      </h3>

      {/* Buttons Grid */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Button 1 - Zeabur */}
        <a
          href={REFERRAL_LINKS.ZEABUR}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105 transform"
        >
          <span className="text-xl">⚡</span>
          <span>{t('monetization.detail.zeabur_btn')}</span>
        </a>

        {/* Button 2 - DigitalOcean */}
        <a
          href={REFERRAL_LINKS.DIGITALOCEAN}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-400 font-semibold transition-all duration-200 hover:scale-105 transform"
        >
          <span className="text-xl">🎁</span>
          <span>{t('monetization.detail.do_btn')}</span>
        </a>
      </div>
    </div>
  );
}








