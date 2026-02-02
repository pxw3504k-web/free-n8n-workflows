"use client";

import { memo } from 'react';
import Link from 'next/link';
import { Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkflowData } from '@/lib/data';
import { WorkflowPreview } from './workflow/WorkflowPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getWorkflowTitle, 
  getWorkflowSummary, 
  getWorkflowCategory, 
  getWorkflowTags 
} from '@/lib/workflow-utils';
import { NodeCount } from './NodeCount';
import { DifficultyBadge } from './DifficultyBadge';

interface WorkflowCardProps {
  workflow: WorkflowData;
  index?: number;
}

function WorkflowCardComponent({ workflow, index = 0 }: WorkflowCardProps) {
  const { language, t } = useLanguage();
  const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
  
  const title = getWorkflowTitle(workflow, language);
  const summary = getWorkflowSummary(workflow, language);
  const category = getWorkflowCategory(workflow, language);
  const tags = getWorkflowTags(workflow, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, // 从 0.4 减少到 0.3
        delay: Math.min(index * 0.03, 0.3) // 限制最大延迟，从 0.05 减少到 0.03
      }}
      whileHover={{ 
        y: -4, // 从 -8 减少到 -4，减少移动距离
        transition: { duration: 0.2 } // 加快 hover 动画
      }}
      className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#1a1a2e] shadow-sm transition-premium hover:border-primary/50"
    >
      {/* Workflow Preview */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0a0a1e] group/preview">
        {/* 工作流预览图 */}
        <div className="absolute inset-0">
          {workflow.json_url ? (
            <WorkflowPreview 
              jsonUrl={workflow.json_url}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0a1e] to-[#1a1a2e]">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xs text-gray-500">No preview available</div>
              </div>
            </div>
          )}
        </div>
        
        {/* 悬停时的遮罩效果 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1e]/90 via-[#0a0a1e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <DifficultyBadge workflow={workflow} />

          {/* Verified Badge */}
          {workflow.is_verified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-md">
              {language === 'zh' ? '✓ 认证' : '✓ Verified'}
          </span>
          )}
        </div>

        {/* 节点数量徽章（右上角） */}
        {workflow.node_count && (
          <div className="absolute top-3 right-3 z-10">
            <div className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-gray-300 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>{workflow.node_count}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 border border-primary/20 px-2 py-1 text-xs font-medium text-primary">
            {category}
          </span>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-white/5 border border-white/5 px-2 py-1 text-xs font-medium text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-100 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/workflow/${workflow.slug}`}>
            {title}
          </Link>
        </h3>

        <p className="mb-4 text-sm text-gray-400 line-clamp-2 flex-1">
          {summary || (language === 'zh' ? '暂无描述' : 'No description available.')}
        </p>

        {/* Footer Info */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Nodes">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="text-gray-300">
                {workflow.node_count === null || workflow.node_count === 0 ? (
                  <NodeCount
                    jsonUrl={workflow.json_url}
                    fallbackCount={workflow.node_count || 0}
                  />
                ) : (
                  workflow.node_count
                )} {t('workflow.nodes')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Views">
              <Eye className="h-3 w-3" />
              <span>{stats?.views || 0}</span>
            </div>
            <div className="flex items-center gap-1" title="Downloads">
              <Download className="h-3 w-3" />
              <span>{stats?.downloads || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
            <Link 
                href={`/workflow/${workflow.slug}`}
                className="flex w-full items-center justify-center rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-white/5 hover:text-primary hover:border-primary transition-all"
            >
                {t('workflow.viewWorkflow')}
            </Link>
        </div>
      </div>
    </motion.div>
  );
}

// 使用 memo 优化重渲染，只有 workflow.id 改变时才重新渲染
export const WorkflowCard = memo(WorkflowCardComponent, (prevProps, nextProps) => {
  return prevProps.workflow.id === nextProps.workflow.id && prevProps.index === nextProps.index;
});
