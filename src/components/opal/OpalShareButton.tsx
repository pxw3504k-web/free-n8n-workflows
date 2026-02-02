'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OpalShareButtonProps {
  slug: string;
  lang: string;
}

export function OpalShareButton({ slug, lang }: OpalShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.length > 0)
        ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
        : (window.location && window.location.origin) || 'https://n8nworkflows.world';

      // 自动检测路由前缀（/opal/ 或 /googleopal/）
      const routePrefix = (typeof window !== 'undefined' && window.location.pathname.includes('/googleopal/')) 
        ? 'googleopal' 
        : 'opal';
      const pageUrl = `${siteUrl}/${routePrefix}/${slug}`;

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const tmp = document.createElement('input');
        tmp.value = pageUrl;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm">{lang === 'zh' ? '已复制' : 'Copied!'}</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span className="text-sm">{lang === 'zh' ? '分享' : 'Share'}</span>
        </>
      )}
    </button>
  );
}

