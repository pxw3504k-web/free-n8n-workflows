'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatAppName } from '@/lib/format';
import { Home, ChevronRight } from 'lucide-react';

interface IntegrationData {
  slug: string;
  app_a: string;
  app_b: string;
  count: number;
}

interface IntegrationDirectoryClientProps {
  integrations: IntegrationData[];
  siteUrl: string;
}

// Group integrations by first letter of app_a
function groupByFirstLetter(integrations: IntegrationData[]): Record<string, IntegrationData[]> {
  const groups: Record<string, IntegrationData[]> = {};
  
  integrations.forEach(integration => {
    const firstLetter = integration.app_a.charAt(0).toUpperCase();
    // Only include A-Z
    if (/[A-Z]/.test(firstLetter)) {
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(integration);
    }
  });
  
  return groups;
}

export default function IntegrationDirectoryClient({ integrations, siteUrl }: IntegrationDirectoryClientProps) {
  const { language } = useLanguage();

  // Group integrations by first letter
  const groupedIntegrations = groupByFirstLetter(integrations);
  
  // Get all available letters (A-Z)
  const availableLetters = Object.keys(groupedIntegrations).sort();
  
  // Generate A-Z array
  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'n8n Integrations Directory',
    description: 'Browse all available n8n workflow integrations and combinations',
    url: `${siteUrl}/integration`,
    numberOfItems: integrations.length,
    publisher: {
      '@type': 'Organization',
      name: 'N8N Workflows',
      url: siteUrl,
    },
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: language === 'zh' ? '首页' : 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: language === 'zh' ? '集成目录' : 'Integrations',
        item: `${siteUrl}/integration`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <main className="flex-1 pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors flex items-center">
              <Home className="w-3 h-3 mr-1" />
              {language === 'zh' ? '首页' : 'Home'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">{language === 'zh' ? '集成目录' : 'Integrations'}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {language === 'zh' ? 'n8n 集成目录' : 'n8n Integrations Directory'}
            </h1>
            <p className="text-gray-400">
              {integrations.length}+ {language === 'zh' ? '个集成组合' : 'integration combinations'} • {' '}
              {integrations.reduce((sum, i) => sum + i.count, 0)}+ {language === 'zh' ? '个工作流' : 'workflows'}
            </p>
          </div>

          {/* A-Z Index */}
          <div className="mb-8 sticky top-20 z-10 bg-[#0a0a1e]/95 backdrop-blur-sm py-4 border-b border-white/10">
            <div className="flex flex-wrap gap-2 justify-center">
              {allLetters.map(letter => {
                const hasData = availableLetters.includes(letter);
                return (
                  <a
                    key={letter}
                    href={`#letter-${letter}`}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      hasData
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Integrations by Letter */}
          <div className="space-y-8">
            {allLetters.map(letter => {
              const letterIntegrations = groupedIntegrations[letter];
              if (!letterIntegrations || letterIntegrations.length === 0) {
                return null;
              }

              return (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">
                    {letter}
                  </h2>
                  <ul className="space-y-1">
                    {letterIntegrations.map((integration, index) => {
                      const appAName = formatAppName(integration.app_a);
                      const appBName = formatAppName(integration.app_b);
                      // Use combination of slug and index to ensure unique key
                      const uniqueKey = `${integration.slug}-${integration.app_a}-${integration.app_b}-${index}`;
                      
                      return (
                        <li key={uniqueKey}>
                          <Link
                            href={`/integration/${integration.slug}`}
                            className="flex items-center justify-between py-2 px-3 rounded hover:bg-white/5 transition-colors group"
                          >
                            <span className="text-sm text-gray-300 group-hover:text-white">
                              <span className="font-medium">{appAName}</span>
                              <span className="text-gray-500 mx-2">+</span>
                              <span className="font-medium">{appBName}</span>
                            </span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-400">
                              {integration.count} {language === 'zh' ? '个工作流' : 'workflows'}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {integrations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400">
                {language === 'zh' ? '暂无集成数据' : 'No integrations available'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
