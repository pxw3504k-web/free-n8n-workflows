'use client';

import Link from 'next/link';
import { OpalApp } from '@/lib/data';
import { OpalCardCover } from './OpalCardCover';
import { ExternalLink } from 'lucide-react';

interface OpalCardProps {
  app: OpalApp;
  lang: string;
}

export function OpalCard({ app, lang }: OpalCardProps) {
  const title = lang === 'zh' ? (app.title_zh || app.title) : app.title;
  const description = lang === 'zh' ? (app.description_zh || app.description) : app.description;

  // 根据 category 获取光晕颜色类
  const getGlowColor = () => {
    const categoryColors: Record<string, string> = {
      'Marketing': 'group-hover:shadow-purple-500/50',
      'Productivity': 'group-hover:shadow-blue-500/50',
      'Development': 'group-hover:shadow-cyan-500/50',
      'Writing': 'group-hover:shadow-green-500/50',
      'Design': 'group-hover:shadow-pink-500/50',
      'Business': 'group-hover:shadow-orange-500/50',
      'Education': 'group-hover:shadow-indigo-500/50',
    };
    return categoryColors[app.category || ''] || 'group-hover:shadow-primary/50';
  };

  return (
    <Link
      href={`/googleopal/${app.slug}${lang === 'zh' ? '?lang=zh' : ''}`}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/20"
    >
      {/* Cover Section - 60% height */}
      <div className="relative h-[60%] min-h-[240px]">
        <OpalCardCover icon={app.icon} category={app.category} />
        
        {/* Featured Badge */}
        {app.is_featured && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Info Section - 40% height */}
      <div className="flex-1 p-6 flex flex-col justify-between bg-zinc-900/50 backdrop-blur-sm">
        <div>
          {/* Category Badge */}
          {app.category && (
            <span className="inline-block px-2 py-1 mb-2 rounded-md bg-white/5 text-xs font-medium text-gray-400 border border-white/10">
              {app.category}
            </span>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {app.opal_official_url && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {lang === 'zh' ? '在 Opal 中试用' : 'Try in Opal'}
            </span>
          )}
          {app.related_n8n_workflow_ids && app.related_n8n_workflow_ids.length > 0 && (
            <span className="text-xs text-gray-500">
              {app.related_n8n_workflow_ids.length} {lang === 'zh' ? '个工作流' : 'workflows'}
            </span>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${getGlowColor()} shadow-2xl`} />
    </Link>
  );
}

