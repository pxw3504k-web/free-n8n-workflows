"use client";

import { useState } from 'react';
import Link from 'next/link';
import { WorkflowData } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Trophy, Sparkles, ChevronRight, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface LeaderboardTabsProps {
  risingList: WorkflowData[];
  topList: WorkflowData[];
  newList: WorkflowData[];
}

type TabType = 'rising' | 'top' | 'new';

export function LeaderboardTabs({ risingList, topList, newList }: LeaderboardTabsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('rising');

  const tabs = [
    {
      id: 'rising' as TabType,
      label: language === 'zh' ? '🔥 新星榜' : '🔥 Rising Stars',
      icon: TrendingUp,
      data: risingList,
    },
    {
      id: 'top' as TabType,
      label: language === 'zh' ? '🏆 殿堂榜' : '🏆 All-Time Best',
      icon: Trophy,
      data: topList,
    },
    {
      id: 'new' as TabType,
      label: language === 'zh' ? '💎 新品榜' : '💎 New & Verified',
      icon: Sparkles,
      data: newList,
    },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const currentData = currentTab?.data || [];

  // Calculate hot score (views + downloads * 2)
  const calculateHotScore = (workflow: WorkflowData): number => {
    const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
    return (stats?.views || 0) + (stats?.downloads || 0) * 2;
  };

  // Get display hot score (智能展示：如果 < 10，加基数 50 让它看起来更活跃)
  const getDisplayHotScore = (workflow: WorkflowData): number => {
    const rawScore = calculateHotScore(workflow);
    return rawScore < 10 ? rawScore + 50 : rawScore;
  };

  // Get download count
  const getDownloadCount = (workflow: WorkflowData): number => {
    const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
    return stats?.downloads || 0;
  };

  // Get display download count (智能展示：如果为 0，显示 1)
  const getDisplayDownloadCount = (workflow: WorkflowData): number => {
    const count = getDownloadCount(workflow);
    return count === 0 ? 1 : count;
  };

  // Get time ago text (for New & Verified tab)
  const getTimeAgo = (workflow: WorkflowData): string => {
    try {
      const createdDate = new Date(workflow.created_at);
      return formatDistanceToNow(createdDate, {
        addSuffix: true,
        locale: language === 'zh' ? zhCN : undefined,
      });
    } catch {
      return language === 'zh' ? '最近' : 'Recently';
    }
  };

  // Get workflow icon (first letter of title or emoji)
  const getWorkflowIcon = (workflow: WorkflowData): string => {
    const title = language === 'zh' && workflow.title_zh ? workflow.title_zh : workflow.title;
    return title ? title.charAt(0).toUpperCase() : '📊';
  };

  // Get workflow title
  const getWorkflowTitle = (workflow: WorkflowData): string => {
    return language === 'zh' && workflow.title_zh ? workflow.title_zh : workflow.title;
  };

  // Get workflow description
  const getWorkflowDescription = (workflow: WorkflowData): string => {
    return language === 'zh' && workflow.summary_short_zh 
      ? workflow.summary_short_zh 
      : (workflow.summary_short || '');
  };

  // Get rank color
  const getRankColor = (index: number): string => {
    if (index === 0) return 'text-yellow-500'; // Gold
    if (index === 1) return 'text-gray-400'; // Silver
    if (index === 2) return 'text-orange-500'; // Bronze
    return 'text-gray-600'; // Default
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap
                transition-all duration-300 transform
                ${isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-102'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-primary animate-pulse opacity-20" />
              )}
            </button>
          );
        })}
      </div>

      {/* Leaderboard List - ProductHunt Style */}
      <div className="space-y-3">
        {currentData.length > 0 ? (
          currentData.map((workflow, index) => {
            const hotScore = calculateHotScore(workflow);
            const downloadCount = getDownloadCount(workflow);
            const workflowIcon = getWorkflowIcon(workflow);
            const title = getWorkflowTitle(workflow);
            const description = getWorkflowDescription(workflow);
            const category = language === 'zh' && workflow.category_zh 
              ? workflow.category_zh 
              : workflow.category;

            return (
              <Link
                key={workflow.id}
                href={`/workflow/${workflow.slug}`}
                className="block group"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-300">
                  {/* Left: Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className={`text-3xl font-bold ${getRankColor(index)}`}>
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className="text-xl mt-1">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </div>
                    )}
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {workflowIcon}
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mb-2">
                        {description || (language === 'zh' ? '暂无描述' : 'No description available')}
                      </p>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {category}
                          </span>
                        )}
                        {workflow.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            <CheckCircle className="w-3 h-3" />
                            {language === 'zh' ? '已认证' : 'Verified'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action/Stats */}
                  <div className="flex-shrink-0 flex items-center gap-4">
                    {/* Stats Box */}
                    <div className="text-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 min-w-[100px]">
                      {activeTab === 'rising' && (
                        <>
                          <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
                            {getDisplayHotScore(workflow).toLocaleString()} 🔥
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {language === 'zh' ? '热度指数' : 'Heat Index'}
                          </div>
                        </>
                      )}
                      {activeTab === 'top' && (
                        <>
                          <div className="text-2xl font-bold text-blue-400">
                            {getDisplayDownloadCount(workflow).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {language === 'zh' ? '下载' : 'Downloads'}
                          </div>
                        </>
                      )}
                      {activeTab === 'new' && (
                        <>
                          <div className="text-sm font-medium text-green-400">
                            {getTimeAgo(workflow)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {language === 'zh' ? '发布时间' : 'Published'}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400">
              {language === 'zh' ? '暂无数据' : 'No data available'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      {currentData.length > 0 && (
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {currentData.length}
              </div>
              <div className="text-xs text-gray-400">
                {language === 'zh' ? '上榜工作流' : 'Listed'}
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {currentData.reduce((sum, w) => {
                  const stats = typeof w.stats === 'string' ? JSON.parse(w.stats) : w.stats;
                  return sum + (stats?.downloads || 0);
                }, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {language === 'zh' ? '总下载' : 'Total Downloads'}
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {currentData.reduce((sum, w) => {
                  const stats = typeof w.stats === 'string' ? JSON.parse(w.stats) : w.stats;
                  return sum + (stats?.views || 0);
                }, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {language === 'zh' ? '总浏览' : 'Total Views'}
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {currentData.filter(w => w.is_verified).length}
              </div>
              <div className="text-xs text-gray-400">
                {language === 'zh' ? '已认证' : 'Verified'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

