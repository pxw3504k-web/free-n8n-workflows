import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface N8nNodeData {
  label: string;
  type: string;
  icon: string;
  nodeType: string;
}

interface N8nNodeProps {
  data: N8nNodeData;
  selected?: boolean;
}

// 这是一个长得像 n8n 官方节点的 React 组件（适配暗色主题）
const N8nNode = ({ data, selected }: N8nNodeProps) => {
  const getNodeTypeColor = (type: string): string => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('trigger') || typeLower.includes('manual')) {
      return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
    if (typeLower.includes('agent') || typeLower.includes('ai') || typeLower.includes('openai') || typeLower.includes('llm')) {
      return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
    }
    if (typeLower.includes('http') || typeLower.includes('webhook') || typeLower.includes('request')) {
      return 'bg-green-500/20 border-green-500/50 text-green-300';
    }
    if (typeLower.includes('set') || typeLower.includes('code') || typeLower.includes('function')) {
      return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
    }
    return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
  };

  const colorClass = getNodeTypeColor(data.type);
  const typeName = data.type.split('.').pop()?.replace('n8n-nodes-base.', '') || data.type;

  return (
    <div 
      className={`
        shadow-lg rounded-lg border-2 min-w-[180px] max-w-[220px] overflow-hidden 
        group hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer
        backdrop-blur-sm
        ${colorClass}
        ${selected ? 'ring-2 ring-primary' : ''}
      `}
    >
      {/* 顶部标题栏 */}
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <span className="text-lg flex-shrink-0">{data.icon}</span>
        <div className="flex flex-col min-w-0 flex-1">
          <span 
            className="text-xs font-semibold truncate" 
            title={data.label}
          >
            {data.label}
          </span>
          <span 
            className="text-[10px] opacity-70 truncate mt-0.5" 
            title={typeName}
          >
            {typeName}
          </span>
        </div>
      </div>
      
      {/* 链接桩 (Handles) - 必须要有，不然线连不上 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-primary !w-3 !h-3 !border-2 !border-[#1a1a2e] hover:!w-4 hover:!h-4 transition-all" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-primary !w-3 !h-3 !border-2 !border-[#1a1a2e] hover:!w-4 hover:!h-4 transition-all" 
      />
    </div>
  );
};

export default memo(N8nNode);

