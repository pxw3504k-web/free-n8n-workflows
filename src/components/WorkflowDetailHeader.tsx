"use client";

import Link from 'next/link';
import { ChevronRight, Home, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { WorkflowData, CollectionData } from '@/lib/data';
import { clsx } from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { getWorkflowTitle } from '@/lib/workflow-utils';
import { NodeCount } from './NodeCount';
import { DifficultyBadge } from './DifficultyBadge';

interface WorkflowDetailHeaderProps {
  workflow: WorkflowData;
  relatedCollection?: CollectionData;
  mainNodeName?: string;
}

export function WorkflowDetailHeader({ workflow, relatedCollection, mainNodeName }: WorkflowDetailHeaderProps) {
  const { language, t } = useLanguage();
  const title = getWorkflowTitle(workflow, language);
  const [copied, setCopied] = useState(false);

  // 获取集合标题（多语言支持）
  const collectionTitle = relatedCollection 
    ? (language === 'zh' && relatedCollection.title_zh ? relatedCollection.title_zh : relatedCollection.title)
    : null;

  const handleCopy = async () => {
    try {
      // Copy the page URL (workflow detail) so shared posts link back to the template page.
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.length > 0)
        ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
        : (window.location && window.location.origin) || 'https://n8nworkflows.world';

      const pageUrl = `${siteUrl}/workflow/${workflow.slug}`;

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
      try {
        trackEvent('share_workflow', { workflow_id: workflow.id, slug: workflow.slug });
      } catch (err) {}
    } catch (err) {
      console.error('Copy failed', err);
    }
  };
  
  const getDifficultyText = (difficulty?: string) => {
    if (!difficulty) return t('workflow.difficulty.beginner');
    const key = `workflow.difficulty.${difficulty.toLowerCase()}` as keyof typeof t;
    return t(key) || difficulty;
  };

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-8 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors flex items-center">
          <Home className="w-3 h-3 mr-1" />
          {language === 'zh' ? '首页' : 'Home'}
        </Link>
        
        {/* 热门集合 */}
        {collectionTitle && relatedCollection && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link 
              href={`/collection/${relatedCollection.slug}`} 
              className="hover:text-white transition-colors font-medium truncate max-w-[150px]"
            >
              {collectionTitle}
            </Link>
          </>
        )}
        
        {/* 节点名称 */}
        {mainNodeName && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400 truncate max-w-[120px] capitalize">
              {mainNodeName}
            </span>
          </>
        )}
        
        {/* 工作流名称 */}
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-400 truncate max-w-[200px]">{title}</span>
      </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        >
        <div className="flex items-start gap-3">
          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          {/* Verified Badge */}
          {workflow.is_verified && (
            <div className="mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {language === 'zh' ? '社区认证' : 'Community Verified'}
              </span>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="ml-2 mt-2 inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-gray-200 hover:bg-white/10"
            title={language === 'zh' ? '复制链接' : 'Copy link'}
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline text-sm text-gray-200">{language === 'zh' ? '分享' : 'Share'}</span>
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById('get-this-workflow');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // 添加一个小延迟以确保滚动完成后再高亮
                setTimeout(() => {
                  element.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
                  setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
                  }, 2000);
                }, 500);
              }
            }}
            className="ml-2 mt-2 inline-flex items-center gap-2 rounded-md bg-primary/20 px-3 py-2 text-sm text-primary hover:bg-primary/30 border border-primary/30"
            title={language === 'zh' ? '复制 N8N JSON' : 'Copy N8N JSON'}
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">{language === 'zh' ? 'Copy N8N' : 'Copy N8N'}</span>
          </button>
          
          {copied && (
            <div className="ml-3 mt-3 text-sm text-emerald-400">
              {t('share.copied')}
            </div>
          )}
        </div>
          
        <div className="flex flex-wrap items-center gap-3 mb-4">
            <DifficultyBadge workflow={workflow} size="md" />
            
            <div className="flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 shadow-lg backdrop-blur-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            <NodeCount
              jsonUrl={workflow.json_url}
              fallbackCount={workflow.node_count || 0}
            /> {t('detail.nodesConnected')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
