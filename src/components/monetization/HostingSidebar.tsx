'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { REFERRAL_LINKS } from '@/lib/constants';

export function HostingSidebar() {
  const { t } = useLanguage();

  return (
    <section className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t('monetization.sidebar.title')}
        </h3>
      </div>

      {/* Hosting Links */}
      <div className="space-y-3">
        {/* Zeabur Block */}
        <a
          href={REFERRAL_LINKS.ZEABUR}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors duration-200 border border-slate-700/30 hover:border-purple-500/30"
        >
          <div className="flex items-start gap-3">
            {/* Zeabur Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-purple-400 text-sm mb-0.5">
                {t('monetization.sidebar.zeabur.title')}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                {t('monetization.sidebar.zeabur.desc')}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0">
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </a>

        {/* DigitalOcean Block */}
        <a
          href={REFERRAL_LINKS.DIGITALOCEAN}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors duration-200 border border-slate-700/30 hover:border-blue-500/30"
        >
          <div className="flex items-start gap-3">
            {/* DigitalOcean Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-blue-400 text-sm mb-0.5">
                {t('monetization.sidebar.do.title')}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                {t('monetization.sidebar.do.desc')}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0">
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}








