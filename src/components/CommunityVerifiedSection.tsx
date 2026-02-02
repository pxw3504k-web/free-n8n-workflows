'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowData } from '@/lib/data';
import { NodeCount } from './NodeCount';

interface CommunityVerifiedSectionProps {
  workflows: WorkflowData[];
}

export function CommunityVerifiedSection({ workflows }: CommunityVerifiedSectionProps) {
  const { language } = useLanguage();
  
  const getStats = (workflow: WorkflowData) => {
    try {
      return typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
    } catch {
      return {};
    }
  };

  const getWorkflowTitle = (workflow: WorkflowData) => {
    return language === 'zh' && workflow.title_zh ? workflow.title_zh : workflow.title;
  };

  const getWorkflowDescription = (workflow: WorkflowData) => {
    return language === 'zh' && workflow.summary_short_zh ? workflow.summary_short_zh : workflow.summary_short;
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {language === 'zh' ? '🔥 社区认证' : '🔥 Community Verified'}
        </h2>
        <span className="text-sm text-gray-400">
          {language === 'zh' ? '精选认证工作流' : 'Verified workflows'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <Link
              key={workflow.id}
              href={`/workflow/${workflow.slug}`}
              className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {getWorkflowTitle(workflow)}
                    </h3>
                  </div>
                  <div className="ml-3 shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {language === 'zh' ? '✅ 已认证' : '✅ Verified'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {getWorkflowDescription(workflow)}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-3">
                    {workflow.json_url && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                        <NodeCount
                          jsonUrl={workflow.json_url}
                          fallbackCount={workflow.node_count || 0}
                        /> {language === 'zh' ? '节点' : 'nodes'}
                      </span>
                    )}
                    {(() => {
                      const stats = getStats(workflow);
                      const stars = stats?.stars;
                      if (!stars) return null;
                      return (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          {String(stars)}
                        </span>
                      );
                    })()}
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
                    {language === 'zh' ? '查看 →' : 'View →'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
}
