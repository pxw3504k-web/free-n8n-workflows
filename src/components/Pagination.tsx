"use client";

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({ totalItems, itemsPerPage }: PaginationProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [isNavigating, setIsNavigating] = useState(false);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isNavigating) return;
    setIsNavigating(true);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
    // 重置状态，让 Next.js 的导航完成
    setTimeout(() => setIsNavigating(false), 100);
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start/end to ensure we show a consistent number of buttons if possible
      let adjustedStart = start;
      let adjustedEnd = end;
      
      if (currentPage <= 4) {
        adjustedEnd = 5;
      } else if (currentPage >= totalPages - 3) {
        adjustedStart = totalPages - 4;
      }

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        if (i > 1 && i < totalPages) {
            pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mt-16 flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isNavigating}
          className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 transition-premium group"
        >
          {isNavigating ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>{t('pagination.previous')}</span>
            </>
          )}
        </button>
        
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page as number)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-premium ${
                  currentPage === page
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-110"
                    : "bg-white text-[#1a1a2e] border border-white/20 hover:bg-gray-100 hover:scale-105"
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>
 
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isNavigating}
          className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 transition-premium group"
        >
          {isNavigating ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{t('pagination.next')}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
