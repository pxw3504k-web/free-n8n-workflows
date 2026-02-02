"use client";

import { BarChart3, Code, Layers, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsData {
  apps_used?: string[];
  top_nodes?: Record<string, number>;
  complexity?: 'Beginner' | 'Intermediate' | 'Advanced';
  node_count?: number;
}

interface WorkflowStatsVisualizationProps {
  statsData: StatsData;
}

export function WorkflowStatsVisualization({ statsData }: WorkflowStatsVisualizationProps) {
  const { language } = useLanguage();

  if (!statsData) {
    return null;
  }

  const { apps_used = [], top_nodes = {}, complexity, node_count } = statsData;

  // 如果没有数据，不显示
  if (apps_used.length === 0 && Object.keys(top_nodes).length === 0 && !complexity && !node_count) {
    return null;
  }

  // 准备 Top Nodes 数据用于条形图
  const topNodesEntries = Object.entries(top_nodes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // 最多显示8个

  const maxCount = topNodesEntries.length > 0 
    ? Math.max(...topNodesEntries.map(([, count]) => count))
    : 1;

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'Beginner':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Advanced':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3" />
        <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
        {language === 'zh' ? '工作流统计' : 'Workflow Statistics'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 复杂度卡片 */}
        {complexity && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 mr-2 text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'zh' ? '复杂度' : 'Complexity'}
              </h4>
            </div>
            <div className={`inline-flex px-4 py-2 rounded-lg border ${getComplexityColor(complexity)}`}>
              <span className="font-bold text-sm">{complexity}</span>
            </div>
          </div>
        )}

        {/* 节点数量卡片 */}
        {node_count !== undefined && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center mb-4">
              <Layers className="w-5 h-5 mr-2 text-purple-400" />
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'zh' ? '节点数量' : 'Node Count'}
              </h4>
            </div>
            <div className="text-3xl font-bold text-white">{node_count}</div>
          </div>
        )}
      </div>

      {/* Top Nodes 条形图 */}
      {topNodesEntries.length > 0 && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center mb-6">
            <Code className="w-5 h-5 mr-2 text-emerald-400" />
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {language === 'zh' ? '最常用节点' : 'Top Nodes'}
            </h4>
          </div>
          <div className="space-y-4">
            {topNodesEntries.map(([nodeName, count]) => {
              const percentage = (count / maxCount) * 100;
              return (
                <div key={nodeName} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">{nodeName}</span>
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Apps Used 标签 */}
      {apps_used.length > 0 && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {language === 'zh' ? '使用的应用' : 'Apps Used'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {apps_used.map((app) => (
              <span
                key={app}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
