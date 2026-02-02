'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowGrid } from '@/components/WorkflowGrid';
import { Pagination } from '@/components/Pagination';
import CollectionZipButton from '@/components/CollectionZipButton';
import { WorkflowData } from '@/lib/data';

interface CollectionDetailClientProps {
  collection: {
    id: string;
    slug: string;
    title: string;
    title_zh?: string;
    description?: string;
    description_zh?: string;
    icon?: string;
    is_featured?: boolean;
    zip_url?: string;
    collection_items?: Array<{
      workflows?: { slug?: string; json_url?: string } | null;
      workflow?: { slug?: string; json_url?: string } | null;
    }>;
    total_workflows?: number;
    current_page?: number;
    total_pages?: number;
  };
  relatedCollections: Array<{
    id: string;
    slug: string;
    title: string;
    title_zh?: string;
    description?: string;
    description_zh?: string;
  }>;
  page: number;
  itemsPerPage: number;
  siteUrl: string;
}

export default function CollectionDetailClient({
  collection,
  relatedCollections,
  page,
  itemsPerPage,
  siteUrl,
}: CollectionDetailClientProps) {
  const { language, t } = useLanguage();

  // Get localized title and description with fallbacks
  const title = language === 'zh' && collection.title_zh ? collection.title_zh : (collection.title || 'Collection');
  const description = language === 'zh' && collection.description_zh ? collection.description_zh : (collection.description || 'A curated collection of automation workflows');

  // Extract workflows from joined rows
  type CollectionItem = {
    workflows?: { slug?: string; json_url?: string } | null;
    workflow?: { slug?: string; json_url?: string } | null;
  };
  const rawItems = Array.isArray(collection.collection_items) ? (collection.collection_items as CollectionItem[]) : [];
  const workflows = rawItems
    .map((it) => it.workflows || it.workflow || null)
    .filter(Boolean) as Array<{ slug?: string; json_url?: string }>;

  const totalWorkflows = collection.total_workflows || 0;
  const totalPages = collection.total_pages || 0;

  // Breadcrumb structured data - ensure absolute URLs
  const baseUrl = siteUrl || 'https://n8nworkflows.world';
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: t('breadcrumb.home'),
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t('breadcrumb.collections'),
      item: `${baseUrl}/collections`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: title,
      item: `${baseUrl}/collection/${collection.slug}`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs - 放在最顶部 */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors flex items-center font-medium">
          <Home className="w-3 h-3 mr-1" />
          {language === 'zh' ? 'n8n 工作流' : 'n8n Workflows'}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/collections" className="hover:text-white transition-colors font-medium">
          {t('breadcrumb.collections')}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-400 truncate max-w-[200px]">{title}</span>
      </nav>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {collection.icon && (
            <div className="w-12 h-12 mr-4 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl">{collection.icon}</span>
            </div>
          )}
          {collection.is_featured && (
            <div className="flex items-center text-yellow-400 mr-4">
              <span className="text-sm font-medium">{t('collections.featured')}</span>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbItems,
            }),
          }}
        />
        <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
        <div className="mt-4 text-sm text-gray-500">
          {totalWorkflows} {t('collections.workflows')}
        </div>
        {/* Download ZIP button */}
        <div className="mt-4">
          <CollectionZipButton
            collectionId={collection.id}
            collectionSlug={collection.slug}
            zipUrl={collection.zip_url}
            workflows={workflows}
          />
        </div>
      </div>

      {workflows.length > 0 ? (
        <>
          <WorkflowGrid workflows={workflows as WorkflowData[]} />
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                totalItems={totalWorkflows}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400">{t('search.noResults')}</p>
        </div>
      )}

      {/* Related Collections */}
      {Array.isArray(relatedCollections) && relatedCollections.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">{t('collection.relatedCollections')}</h2>
            <Link
              href="/"
              className="hidden md:flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary hover:text-primary-light transition-all text-sm font-medium"
            >
              {language === 'zh' ? '浏览全部 n8n 工作流' : 'Browse All n8n Workflows'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedCollections.map((rc) => {
              if (!rc || !rc.id) return null;
              const rcTitle = language === 'zh' && rc.title_zh ? rc.title_zh : (rc.title || 'Collection');
              const rcDescription = language === 'zh' && rc.description_zh ? rc.description_zh : (rc.description || 'A curated collection of workflows');
              const rcSlug = rc.slug || rc.id;
              return (
                <Link
                  key={rc.id}
                  href={`/collection/${rcSlug}`}
                  className="block rounded-lg border border-white/10 p-4 bg-[#0f1724] hover:border-primary/40"
                >
                  <div className="text-sm font-semibold text-white">{rcTitle}</div>
                  <div className="text-xs text-gray-400 mt-2 line-clamp-2">{rcDescription}</div>
                </Link>
              );
            }).filter(Boolean)}
          </div>

          {/* Mobile link */}
          <div className="md:hidden mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary hover:text-primary-light transition-all text-sm font-medium"
            >
              {language === 'zh' ? '浏览全部 n8n 工作流' : 'Browse All n8n Workflows'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

