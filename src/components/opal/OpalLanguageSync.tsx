'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * 客户端组件：同步 LanguageContext 和 URL 的 lang 参数
 * 当语言变化时，更新 URL，触发服务器组件重新渲染
 */
export function OpalLanguageSync() {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 检查当前 URL 的 lang 参数
    const urlLang = searchParams.get('lang');
    
    // 如果 URL 的 lang 参数与 context 中的语言不一致，更新 URL
    if (language === 'zh' && urlLang !== 'zh') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', 'zh');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else if (language === 'en' && urlLang === 'zh') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('lang');
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [language, pathname, router, searchParams]);

  return null; // 这个组件不渲染任何内容
}

