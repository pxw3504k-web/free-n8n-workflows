'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { parseN8nToReactFlow } from '@/lib/n8n-parser';

interface WorkflowPreviewProps {
  jsonUrl?: string;
  jsonData?: Record<string, unknown>;
  className?: string;
  lazy?: boolean; // 是否延迟加载
}

// 轻量级工作流预览组件，用于卡片展示
export function WorkflowPreview({ jsonUrl, jsonData, className = '', lazy = true }: WorkflowPreviewProps) {
  const [workflowData, setWorkflowData] = useState<Record<string, unknown> | null>(jsonData || null);
  const [loading, setLoading] = useState(!!jsonUrl && !jsonData);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy || !!jsonData || !jsonUrl);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer 用于延迟加载 - 增加延迟，减少初始请求
  useEffect(() => {
    if (!lazy || jsonData || !jsonUrl) {
      // setIsVisible(true); // Handled in initial state
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 添加小延迟，避免同时加载太多
            setTimeout(() => {
              setIsVisible(true);
            }, Math.random() * 200); // 0-200ms 随机延迟，分散请求
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' } // 提前100px开始加载
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, jsonData, jsonUrl]);

  // 从 URL 获取 JSON 数据 - 添加简单的内存缓存
  useEffect(() => {
    if (jsonUrl && !jsonData && isVisible) {
      // 检查内存缓存
      const cacheKey = `workflow-${jsonUrl}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          setTimeout(() => {
            setWorkflowData(JSON.parse(cached));
            setLoading(false);
          }, 0);
          return;
        } catch {
          // 缓存无效，继续请求
        }
      }

      setTimeout(() => setLoading(true), 0);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

      fetch(jsonUrl, {
        signal: controller.signal,
        mode: 'cors',
        cache: 'force-cache', // 利用浏览器缓存
      })
        .then(res => {
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then(data => {
          // 存入 sessionStorage 缓存
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          } catch {
            // 存储失败不影响功能
          }
          setWorkflowData(data);
          setLoading(false);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          setError(true);
          setLoading(false);
        });

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }
  }, [jsonUrl, jsonData, isVisible]);

  const { nodes, minX, minY, maxX, maxY } = useMemo(() => {
    if (!workflowData) {
      return { nodes: [], minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    try {
      const { nodes: parsedNodes } = parseN8nToReactFlow(workflowData);
      
      // 限制节点数量，只显示前 15 个节点（性能优化）
      const limitedNodes = parsedNodes.slice(0, 15);

      if (limitedNodes.length === 0) {
        return { nodes: [], minX: 0, minY: 0, maxX: 0, maxY: 0 };
      }

      // 计算边界
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      limitedNodes.forEach(node => {
        const { x, y } = node.position;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + 180); // 节点宽度
        maxY = Math.max(maxY, y + 60);  // 节点高度
      });

      // 添加边距
      const padding = 50;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;

      return { nodes: limitedNodes, minX, minY, maxX, maxY };
    } catch {
      return { nodes: [], minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
  }, [workflowData]);

  const getNodeTypeColor = (type: string): string => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('trigger') || typeLower.includes('manual')) return '#3b82f6'; // blue
    if (typeLower.includes('agent') || typeLower.includes('ai') || typeLower.includes('openai')) return '#a855f7'; // purple
    if (typeLower.includes('http') || typeLower.includes('webhook')) return '#10b981'; // green
    if (typeLower.includes('set') || typeLower.includes('code')) return '#eab308'; // yellow
    return '#6b7280'; // gray
  };

  const getNodeIcon = (type: string): string => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('trigger') || typeLower.includes('manual')) return '🔘';
    if (typeLower.includes('agent') || typeLower.includes('ai')) return '🤖';
    if (typeLower.includes('http') || typeLower.includes('webhook')) return '🌐';
    if (typeLower.includes('set') || typeLower.includes('code')) return '⚙️';
    return '📦';
  };

  if (loading) {
    return (
      <div ref={containerRef} className={`flex items-center justify-center bg-[#0a0a1e] ${className}`}>
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || nodes.length === 0) {
    // 显示占位符
    return (
      <div ref={containerRef} className={`flex items-center justify-center bg-linear-to-br from-[#0a0a1e] to-[#1a1a2e] ${className}`}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-xs text-gray-500">Workflow Preview</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-[#0a0a1e] ${className}`}>
      <svg
        className="w-full h-full"
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrowhead-preview"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="2.5"
            orient="auto"
          >
            <polygon
              points="0 0, 8 2.5, 0 5"
              fill="#9fa3f5"
              opacity="0.4"
            />
          </marker>
        </defs>

        {/* 绘制简化的连接线（只显示主要连接） */}
        {nodes.slice(0, 10).map((node, index) => {
          if (index === nodes.length - 1) return null;
          const nextNode = nodes[index + 1];
          const color = getNodeTypeColor(node.data.type as string);
          
          return (
            <line
              key={`line-${index}`}
              x1={node.position.x + 180}
              y1={node.position.y + 30}
              x2={nextNode.position.x}
              y2={nextNode.position.y + 30}
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.3"
              markerEnd="url(#arrowhead-preview)"
            />
          );
        })}

        {/* 绘制节点（简化版） */}
        {nodes.map((node, index) => {
          const { x, y } = node.position;
          const color = getNodeTypeColor(node.data.type as string);
          const icon = getNodeIcon(node.data.type as string);
          const isLarge = index < 3; // 前3个节点稍大一些

          return (
            <g key={node.id}>
              {/* 节点背景 */}
              <rect
                x={x}
                y={y}
                width={isLarge ? 160 : 140}
                height={isLarge ? 50 : 45}
                rx="6"
                fill={`${color}20`}
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              
              {/* 节点内容 */}
              <foreignObject x={x + 8} y={y + 8} width={isLarge ? 144 : 124} height={isLarge ? 34 : 29}>
                <div className="flex items-center gap-2 h-full">
                  <span className="text-xs shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-[10px] font-semibold truncate text-white"
                      style={{ color: color }}
                    >
                      {node.data.label as string}
                    </div>
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* 渐变遮罩（底部） */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#0a0a1e] to-transparent pointer-events-none" />
    </div>
  );
}

