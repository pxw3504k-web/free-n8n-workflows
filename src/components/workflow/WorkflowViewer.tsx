'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Panel,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // 引入样式

import { parseN8nToReactFlow } from '@/lib/n8n-parser';
import N8nNode from './N8nNode';
import { useLanguage } from '@/contexts/LanguageContext';

// 注册自定义节点
const nodeTypes = {
  n8nNode: N8nNode,
};

interface WorkflowViewerProps {
  jsonData: Record<string, unknown>;
}

export default function WorkflowViewer({ jsonData }: WorkflowViewerProps) {
  const { language } = useLanguage();
  
  // 状态管理
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isInteracting, setIsInteracting] = useState(false); // 控制遮罩
  const [isLoading, setIsLoading] = useState(true);

  // 1. 初始化时解析 JSON
  useEffect(() => {
    if (jsonData) {
      try {
        const { nodes: initNodes, edges: initEdges } = parseN8nToReactFlow(jsonData);
        setNodes(initNodes);
        setEdges(initEdges);
        setTimeout(() => setIsLoading(false), 0);
      } catch (error) {
        console.error('Error parsing workflow JSON:', error);
        setTimeout(() => setIsLoading(false), 0);
      }
    } else {
      setTimeout(() => setIsLoading(false), 0);
    }
  }, [jsonData, setNodes, setEdges]);

  // 处理节点点击，进入交互模式
  const onNodeClick = useCallback(() => {
    if (!isInteracting) {
      setIsInteracting(true);
    }
  }, [isInteracting]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0a0a1e] rounded-2xl border border-white/10">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading Workflow...</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0a0a1e] rounded-2xl border border-white/10">
        <p className="text-gray-500 text-sm">No workflow data available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[600px] border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a1e] shadow-2xl">
      {/* 2. React Flow 画布 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        // 当用户点击遮罩前，禁止滚轮缩放，防止干扰页面滚动
        panOnDrag={isInteracting}
        panOnScroll={isInteracting}
        zoomOnScroll={isInteracting}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        className="bg-[#0a0a1e]"
      >
        <Background 
          gap={20} 
          size={1} 
          color="#1a1a2e" 
          variant={BackgroundVariant.Dots}
        />
        
        {isInteracting && (
          <Controls 
            className="bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl [&_button]:bg-[#0a0a1e] [&_button]:border-white/10 [&_button]:text-gray-300 hover:[&_button]:bg-white/5 [&_button]:transition-colors" 
          />
        )}

        {/* 节点和连接统计 */}
        {isInteracting && (
          <Panel position="top-left" className="bg-[#1a1a2e]/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300">
            <div className="flex gap-4">
              <span>{nodes.length} {language === 'zh' ? '个节点' : 'nodes'}</span>
              <span>{edges.length} {language === 'zh' ? '个连接' : 'connections'}</span>
            </div>
          </Panel>
        )}
      </ReactFlow>

      {/* 3. "Click to Explore" 遮罩层 (复刻竞品体验) */}
      {!isInteracting && (
        <div 
          className="absolute inset-0 bg-[#0a0a1e]/80 backdrop-blur-[2px] flex items-center justify-center z-10 cursor-pointer group"
          onClick={() => setIsInteracting(true)}
        >
          <div className="bg-[#1a1a2e]/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-white/10 text-gray-200 font-semibold flex items-center gap-2 group-hover:scale-105 group-hover:border-primary/50 transition-all">
            <span className="text-xl">👆</span>
            <span>Click to explore workflow</span>
          </div>
        </div>
      )}

      {/* 4. 退出交互按钮 */}
      {isInteracting && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsInteracting(false);
          }}
          className="absolute top-4 right-4 bg-[#1a1a2e] backdrop-blur-sm px-4 py-2 text-xs rounded-lg border border-white/10 shadow-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all z-20"
        >
          Exit View
        </button>
      )}
    </div>
  );
}

