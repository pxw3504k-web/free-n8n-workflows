"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Eye, Download, User, Copy, Code } from 'lucide-react';
import { motion } from 'framer-motion';

import { WorkflowData } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getWorkflowTitle,
  getWorkflowSummary,
  getWorkflowCategory,
  getWorkflowTags,
  getWorkflowOverview,
  getWorkflowFeatures,
  getWorkflowHowToUse,
} from '@/lib/workflow-utils';
import { DeployOptions } from '@/components/monetization/DeployOptions';
import { WorkflowFAQSection } from './WorkflowFAQSection';
import { WorkflowStatsVisualization } from './WorkflowStatsVisualization';
import { WorkflowRedditComments } from './WorkflowRedditComments';

interface WorkflowDetailContentProps {
  workflow: WorkflowData;
}

export function WorkflowDetailContent({ workflow }: WorkflowDetailContentProps) {
  const { language, t } = useLanguage();
  const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;
  const [mounted, setMounted] = useState(false);
  const [calculatedNodeCount, setCalculatedNodeCount] = useState<number | null>(null);

  // Get localized content
  const title = getWorkflowTitle(workflow, language);
  const summary = getWorkflowSummary(workflow, language);
  const category = getWorkflowCategory(workflow, language);
  const tags = getWorkflowTags(workflow, language);
  const overview = getWorkflowOverview(workflow, language);
  const features = getWorkflowFeatures(workflow, language);
  const howToUse = getWorkflowHowToUse(workflow, language);

  useEffect(() => {
    // Use a small delay to avoid the "synchronous update" lint error
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Calculate accurate node count
  useEffect(() => {
    if (workflow.json_url && (!workflow.node_count || workflow.node_count === 0)) {
      const calculateNodes = async () => {
        try {
          const response = await fetch(workflow.json_url!, {
            cache: 'force-cache',
          });
          const data = await response.json();
          const count = Array.isArray(data.nodes) ? data.nodes.length : workflow.node_count || 0;
          setCalculatedNodeCount(count);
        } catch (error) {
          console.warn('Failed to calculate node count:', error);
          setCalculatedNodeCount(workflow.node_count || 0);
        }
      };
      calculateNodes();
    }
  }, [workflow.json_url, workflow.node_count]);

  return (
    <div className="space-y-8">
      {/* Main Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-8 shadow-xl"
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            <User className="w-3.5 h-3.5 mr-2 text-primary" />
            Free N8N Temples
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-2 text-primary" />
            {mounted ? new Date(workflow.created_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US') : '--'}
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5 mr-2 text-primary" />
            {stats?.views || 0} {t('workflow.views')}
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
            <Download className="w-3.5 h-3.5 mr-2 text-primary" />
            {stats?.downloads || 0} {t('workflow.downloads')}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
          {tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 rounded bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-300 leading-relaxed text-lg italic border-l-4 border-primary pl-6 py-2">
          {summary}
        </p>
      </motion.div>

      {/* Detailed Sections */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-8 shadow-xl space-y-12"
      >
        {/* Deploy Options - Monetization */}
        <DeployOptions />

        {/* Stats Visualization - SEO Enhancement - Moved before About */}
        {workflow.stats_data && (
          <WorkflowStatsVisualization statsData={workflow.stats_data} />
        )}

        {overview && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-primary rounded-full mr-3" />
              {t('detail.about')}
          </h3>
          <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400">
              <ReactMarkdown>{overview}</ReactMarkdown>
          </div>
        </section>
        )}

        {features && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-accent rounded-full mr-3" />
              {t('detail.features')}
          </h3>
          <div className="prose prose-invert max-w-none prose-li:text-gray-400">
              <ReactMarkdown>{features}</ReactMarkdown>
          </div>
        </section>
        )}

        {howToUse && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3" />
              {t('detail.howToUse')}
          </h3>
          <div className="prose prose-invert max-w-none prose-li:text-gray-400">
              <ReactMarkdown>{howToUse}</ReactMarkdown>
          </div>
        </section>
        )}

        {/* FAQ Section - SEO Enhancement */}
        {workflow.faq_data && Array.isArray(workflow.faq_data) && workflow.faq_data.length > 0 && (
          <WorkflowFAQSection faqData={workflow.faq_data} />
        )}

        {/* Reddit Comments - SEO Enhancement */}
        {workflow.reddit_comments && Array.isArray(workflow.reddit_comments) && workflow.reddit_comments.length > 0 && (
          <WorkflowRedditComments comments={workflow.reddit_comments} />
        )}

        {/* Apps Used Section */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3" />
            {t('detail.appsUsed')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <span className="text-emerald-500 font-bold text-xs">{tag.charAt(0)}</span>
                </div>
                <span className="text-sm text-gray-300 font-medium">{tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* JSON Preview Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3" />
              {t('detail.workflowJson')}
            </h3>
            <button 
              onClick={() => {
                const nodeCount = calculatedNodeCount !== null ? calculatedNodeCount : (workflow.node_count || 0);
                navigator.clipboard.writeText(JSON.stringify({ id: workflow.id, title: title, nodes: nodeCount }, null, 2));
                alert(language === 'zh' ? '示例 JSON 已复制到剪贴板！' : 'Sample JSON copied to clipboard!');
              }}
              className="flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Copy className="w-3.5 h-3.5 mr-2" />
              {t('detail.copySample')}
            </button>
          </div>
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a1e] p-6 overflow-hidden group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Code className="w-5 h-5 text-blue-500/50" />
            </div>
            <pre className="text-xs text-blue-400/80 font-mono overflow-x-auto">
              {`{
  "id": "${workflow.id}",
  "name": "${title}",
  "nodes": ${calculatedNodeCount !== null ? calculatedNodeCount : (workflow.node_count || 0)},
  "category": "${category}",
  "status": "active",
  "version": "1.0.0"
}`}
            </pre>
            <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <p className="text-[10px] text-blue-400/70 leading-relaxed">
                {language === 'zh' 
                  ? '注意：这是一个示例预览。完整的工作流 JSON 包含节点配置、凭证占位符和执行逻辑。'
                  : 'Note: This is a sample preview. The full workflow JSON contains node configurations, credentials placeholders, and execution logic.'}
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
