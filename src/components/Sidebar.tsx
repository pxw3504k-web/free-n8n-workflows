"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { HostingSidebar } from '@/components/monetization/HostingSidebar';
import Link from 'next/link';
import { PERSONA_CONFIG } from '@/lib/personaConfig';
import { Sparkles } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  nameZh?: string;
  count: number;
}

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {
  const languageContext = useLanguage();
  const language = languageContext?.language || 'en';
  const t = languageContext?.t || ((key: string) => key);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const selectedCategories = searchParams.get('category')?.split(',') || [];
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [showAllPersonas, setShowAllPersonas] = useState(false);
  
  // 默认显示前3个角色
  const personaEntries = Object.entries(PERSONA_CONFIG);
  const displayedPersonas = showAllPersonas ? personaEntries : personaEntries.slice(0, 3);

  useEffect(() => {
    const el = document.getElementById('workflows-grid');
    if (!el) {
      // Fallback: set a reasonable height approximating 12 cards
      setMaxHeight(1200);
      return;
    }

    const updateHeight = () => {
      const rect = el.getBoundingClientRect();
      setMaxHeight(Math.round(rect.height));
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });
    ro.observe(el);

    window.addEventListener('resize', updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Helper function to get category name based on language
  const getCategoryName = (category: Category) => {
    return language === 'zh' && category.nameZh ? category.nameZh : category.name;
  };

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    let newCategories = [...selectedCategories];

    if (newCategories.includes(categoryId)) {
      newCategories = newCategories.filter((id) => id !== categoryId);
    } else {
      newCategories.push(categoryId);
    }

    if (newCategories.length > 0) {
      params.set('category', newCategories.join(','));
    } else {
      params.delete('category');
    }

    params.set('page', '1'); // Reset to first page on filter change
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    params.set('page', '1'); // Reset to first page on sort change
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {/* Main Sidebar Card */}
        <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-xl shadow-black/20">
          {/* Who Am I Section */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('sidebar.whoAmI')}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {t('sidebar.whoAmIDesc')}
            </p>
            <div className="space-y-2">
              {displayedPersonas.map(([role, config]) => (
                <Link
                  key={role}
                  href={`/for/${role}`}
                  className="block px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {t(`sidebar.persona.${role}`)}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
            {personaEntries.length > 3 && (
              <button
                onClick={() => setShowAllPersonas(!showAllPersonas)}
                className="mt-3 w-full text-xs text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
              >
                {showAllPersonas ? (
                  <>
                    <span>{t('sidebar.showLess')}</span>
                    <span className="text-[10px]">▲</span>
                  </>
                ) : (
                  <>
                    <span>{t('sidebar.showMore')} ({personaEntries.length - 3})</span>
                    <span className="text-[10px]">▼</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              {t('sidebar.sortBy')}
            </h3>
            <div className="space-y-1">
              {[
                { value: 'Most Downloaded', key: 'sort.mostPopular' },
                { value: 'Newest', key: 'sort.newest' },
                { value: 'Trending', key: 'sort.trending' },
                { value: 'Community Verified', key: 'sort.communityVerified' },
                { value: 'Hard to Easy', key: 'sort.hardToEasy' },
                { value: 'Easy to Hard', key: 'sort.easyToHard' },
              ].map((sort) => (
                <div 
                  key={sort.value} 
                  className="group flex items-center px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => handleSortChange(sort.value)}
                >
                  <input
                    id={`sort-${sort.value}`}
                    name="sort"
                    type="radio"
                    checked={searchParams.get('sort') === sort.value || (sort.value === 'Most Downloaded' && !searchParams.get('sort'))}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSortChange(sort.value);
                    }}
                    className="h-4 w-4 border-white/20 bg-[#0a0a1e] text-primary focus:ring-primary/50 cursor-pointer transition-all checked:border-primary"
                  />
                  <label
                    htmlFor={`sort-${sort.value}`}
                    className="ml-3 text-sm text-gray-400 group-hover:text-white cursor-pointer transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t(sort.key)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="my-6 border-t border-white/10" />

          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              {t('sidebar.categories')}
            </h3>
            <div className="space-y-1" style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflowY: 'auto' }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <input
                        id={`category-${category.id}`}
                        name="category"
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCategoryChange(category.id);
                        }}
                        className="peer h-4 w-4 rounded border-white/20 bg-[#0a0a1e] text-primary focus:ring-primary/50 cursor-pointer transition-all checked:border-primary"
                      />
                    </div>
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-3 text-sm text-gray-400 group-hover:text-white cursor-pointer transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {getCategoryName(category)}
                    </label>
                  </div>
                  {/* count removed — values are unreliable */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hosting Sidebar - Monetization */}
        <HostingSidebar />
      </div>
    </aside>
  );
}
