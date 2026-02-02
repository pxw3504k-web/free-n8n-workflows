"use client";


import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import { MotionButton } from "./ui/MotionButton";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchBar from "./SearchBar";
import { useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    
    // 更新 URL 的 lang 参数
    const params = new URLSearchParams(searchParams.toString());
    if (newLang === 'zh') {
      params.set('lang', 'zh');
    } else {
      params.delete('lang'); // 英文是默认值，可以删除参数
    }
    
    // 更新 URL，不触发页面重新加载
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#1a1a2e]/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <svg 
                width="24" 
                height="24" 
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
            <span className="hidden font-bold sm:inline-block text-xl text-white tracking-tight">
              {t('brand.name')}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/integration"
              className="transition-premium text-gray-400 hover:text-white whitespace-nowrap"
            >
              {t('nav.integrations')}
            </Link>
            
            <Link
              href="/leaderboard"
              className="transition-premium text-gray-400 hover:text-white whitespace-nowrap"
            >
              🏆 {t('nav.leaderboard')}
            </Link>

            <Link
              href="/tools"
              className="transition-premium text-gray-400 hover:text-white whitespace-nowrap"
            >
              🛠️ {t('nav.tools')}
            </Link>
            
            {/* Explore 下拉菜单 */}
            <div 
              className="relative group"
              onMouseEnter={() => {
                // 清除任何待关闭的定时器
                if (closeTimeoutRef.current) {
                  clearTimeout(closeTimeoutRef.current);
                  closeTimeoutRef.current = null;
                }
                setShowExploreMenu(true);
              }}
              onMouseLeave={() => {
                // 延迟关闭，给用户时间移动到悬浮窗
                closeTimeoutRef.current = setTimeout(() => {
                  setShowExploreMenu(false);
                }, 200);
              }}
            >
              <button className="flex items-center gap-1 transition-premium text-gray-400 hover:text-white whitespace-nowrap">
                {language === 'zh' ? '探索' : 'Explore'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {showExploreMenu && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl py-2 z-50"
                  onMouseEnter={() => {
                    // 清除任何待关闭的定时器
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                      closeTimeoutRef.current = null;
                    }
                    setShowExploreMenu(true);
                  }}
                  onMouseLeave={() => {
                    // 延迟关闭
                    closeTimeoutRef.current = setTimeout(() => {
                      setShowExploreMenu(false);
                    }, 200);
                  }}
                >
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t('nav.workflows')}
                  </Link>
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t('nav.categories')}
                  </Link>
                  <Link
                    href="/authors"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t('nav.authors')}
                  </Link>
                  <Link
                    href="/collections"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t('nav.collections')}
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                      HOT
                    </span>
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/googleopal"
              className="transition-premium text-gray-400 hover:text-white relative whitespace-nowrap"
            >
              {t('nav.opal')}
              <span className="absolute -top-2 -right-8 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg shadow-orange-500/50 animate-pulse">
                NEW
              </span>
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="hidden md:block w-full flex-1 md:w-auto md:flex-none">
            <SearchBar compact />
          </div>
          
          <button className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-premium hover:bg-white/10 h-10 w-10 md:hidden text-gray-400" aria-label="Toggle search">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            <span className="sr-only">Toggle search</span>
          </button>

          <div className="flex items-center gap-3">
            {/* 语言切换按钮 */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-premium hover:bg-white/10 h-10 w-10 text-gray-400 hover:text-white"
              title={language === 'en' ? '切换到中文' : 'Switch to English'}
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1 text-xs font-semibold">{language === 'en' ? 'EN' : '中文'}</span>
            </button>

            <Link href="/advertise">
              <MotionButton 
                variant="secondary"
                className="hidden sm:inline-flex border-white/10 hover:bg-white/10 relative group"
              >
                <span className="flex items-center gap-2">
                  {t('nav.advertise')}
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg shadow-orange-500/50 animate-pulse">
                    {language === 'zh' ? '新' : 'NEW'}
                  </span>
                </span>
              </MotionButton>
            </Link>
            <Link href="/submit">
              <MotionButton 
                variant="secondary"
                className="hidden sm:inline-flex border-white/10 hover:bg-white/10"
              >
                {t('nav.submit')}
              </MotionButton>
            </Link>
          </div>
        </div>
      </div>


    </header>
  );
}
