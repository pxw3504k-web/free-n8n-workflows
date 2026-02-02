'use client';

import { useEffect } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';

/**
 * 这是一个同步组件，确保 URL 中的 lang 参数能驱动 LanguageContext
 * 模仿 OpalLanguageSync 的逻辑
 */
export function ToolsLanguageSync() {
  const { language, setLanguage } = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlLang = searchParams.get('lang') as Language | null;
    
    // 如果 URL 中有 lang 参数，且与当前 context 语言不一致，则更新 context
    if (urlLang && (urlLang === 'en' || urlLang === 'zh') && urlLang !== language) {
      setLanguage(urlLang);
    }
  }, [searchParams, language, setLanguage]);

  return null;
}
