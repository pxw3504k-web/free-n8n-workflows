 "use client";

import Link from 'next/link';
import { Newsletter } from './Newsletter';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatAppName } from '@/lib/format';
import { useState, useEffect } from 'react';

interface CollectionData {
  id: string;
  slug: string;
  title: string;
  title_zh?: string;
  description?: string;
  description_zh?: string;
  icon?: string;
  is_featured?: boolean;
  workflow_count?: number;
}

interface IntegrationPairData {
  slug: string;
  app_a: string;
  app_b: string;
  count: number;
}

const footerLinks = {
  // quick links and placeholders
  quickLinks: [
    { nameKey: 'footer.workflows', href: '/' },
    { nameKey: 'footer.categories', href: '/categories' },
    { nameKey: 'footer.leaderboard', href: '/leaderboard' },
    { nameKey: 'footer.authors', href: '/authors' },
    { nameKey: 'footer.collections', href: '/collections' },
    { nameKey: 'footer.opal', href: '/googleopal' },
  ],
};

export function Footer() {
  const { t, language } = useLanguage();
  const [showQr, setShowQr] = useState(false);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationPairData[]>([]);

  // Listen for global event to open QR modal (from other components)
  useEffect(() => {
    const handler = () => setShowQr(true);
    window.addEventListener('open-join-qr', handler);
    return () => window.removeEventListener('open-join-qr', handler);
  }, []);

  // Fetch collections for Browse by Category section
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }
        const data: CollectionData[] = await response.json();
        // Filter to show only collections with workflows and limit to 6
        const filteredCollections = data
          .filter(collection => collection.workflow_count && collection.workflow_count > 0)
          .slice(0, 6);
        setCollections(filteredCollections);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };

    fetchCollections();
  }, []);

  // Fetch popular integrations for internal link building
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await fetch('/api/integrations');
        if (!response.ok) {
          throw new Error('Failed to fetch integrations');
        }
        const data: IntegrationPairData[] = await response.json();
        // Limit to top 24 most popular integrations
        setIntegrations(data.slice(0, 24));
      } catch (error) {
        console.error('Failed to fetch integrations:', error);
      }
    };

    fetchIntegrations();
  }, []);

  return (
    <>
    <footer className="border-t border-gray-800 bg-[#1a1a2e] pt-16 pb-8">
      <div className="container mx-auto px-4 space-y-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                  <path d="M12 7v12" />
                  <path d="M12 12H5" />
                  <path d="M12 12h7" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t('brand.name')}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs leading-relaxed">
              {t('footer.description')}
            </p>
            <p className="mt-3 text-xs text-gray-400 max-w-xs leading-relaxed">
              {t('footer.declaration')}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white">{t('footer.quickLinks')}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
              {/* Add category links from collections */}
              {collections.length > 0 && (
                <>
                  {collections.map((collection) => {
                    const title = language === 'zh' && collection.title_zh ? collection.title_zh : collection.title;
                    return (
                      <li key={collection.id}>
                        <Link 
                          href={`/collection/${collection.slug}`} 
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {title}
                        </Link>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{t('footer.contact')}</h3>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-sm text-white"
                onClick={() => setShowQr(true)}
              >
                {t('footer.joinGroup')}
              </button>
              <p className="text-xs text-gray-400 mt-3">{t('contact.scanHint')}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
             <Newsletter />
          </div>
        </div>

        {/* Popular Integrations Section - SEO Internal Links */}
        {integrations.length > 0 && (
          <div className="border-t border-gray-800 pt-12">
            <h3 className="text-sm font-semibold text-white mb-6">
              {t('footer.popularIntegrations')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-8">
              {integrations.map((integration) => {
                const appAName = formatAppName(integration.app_a);
                const appBName = formatAppName(integration.app_b);
                const linkText = `${appAName} + ${appBName}`;

                return (
                  <Link
                    key={integration.slug}
                    href={`/integration/${integration.slug}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {linkText}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6">
              <Link
                href="/integration"
                className="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                {language === 'zh' ? '查看所有 500+ 集成' : 'View all 500+ integrations'}
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} {t('brand.name')}. All rights reserved.
            </p>
            <div className="flex gap-6">
                <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">{t('footer.privacy')}</Link>
                <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">{t('footer.terms')}</Link>
            </div>
        </div>
      </div>
    </footer>
      {showQr && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowQr(false)}
          />
          <div className="relative z-70 bg-[#0b0b1f] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <button
              onClick={() => setShowQr(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-4">{t('footer.joinGroup')}</h3>
            <img
              src="https://storage.googleapis.com/aiseo-image/images/static/qr.jpg"
              alt="Group QR"
              className="w-64 h-64 mx-auto rounded-md border border-white/10"
            />
            <p className="text-center text-sm text-gray-400 mt-4">{t('contact.scanHint')}</p>
          </div>
        </div>
      )}
    </>
  );
}
