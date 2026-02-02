import { Node, Edge, MarkerType } from '@xyflow/react';

// 定义 n8n JSON 的大概结构
interface N8nNode {
  id?: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters?: Record<string, unknown>;
}

interface N8nConnection {
  [sourceNode: string]: {
    [outputType: string]: Array<Array<{
      node: string;
      type: string;
      index: number;
    } | [string, number]>>;
  };
}

interface N8nWorkflowData {
  nodes: N8nNode[];
  connections: N8nConnection;
}

export const parseN8nToReactFlow = (workflow: N8nWorkflowData | Record<string, unknown>) => {
  const rfNodes: Node[] = [];
  const rfEdges: Edge[] = [];

  if (!workflow || !Array.isArray((workflow as N8nWorkflowData).nodes)) {
    return { nodes: [], edges: [] };
  }

  const n8nWorkflow = workflow as N8nWorkflowData;

  // 1. 转换节点 (Nodes)
  n8nWorkflow.nodes.forEach((node) => {
    rfNodes.push({
      id: node.name || node.id || `node-${rfNodes.length}`, // 优先使用 name，fallback 到 id
      type: 'n8nNode', // 自定义节点类型
      position: { x: node.position[0], y: node.position[1] },
      data: { 
        label: node.name,
        type: node.type, // 例如 "n8n-nodes-base.webhook"
        icon: getNodeIcon(node.type), // 辅助函数：根据类型决定图标
        nodeType: node.type,
      },
    });
  });

  // 2. 转换连线 (Edges)
  if (n8nWorkflow.connections) {
    Object.keys(n8nWorkflow.connections).forEach((sourceName) => {
      const outputs = n8nWorkflow.connections[sourceName];
      
      // 遍历所有输出类型（main, ai_languageModel 等）
      Object.keys(outputs).forEach((outputType) => {
        const connectionsArray = outputs[outputType];
        
        if (Array.isArray(connectionsArray)) {
          connectionsArray.forEach((connectionGroup, outputIndex) => {
            if (Array.isArray(connectionGroup)) {
              connectionGroup.forEach((conn, connIndex) => {
                // 支持两种格式：对象格式 {node: "name", ...} 或数组格式 ["nodeId", index]
                let targetNodeName: string | undefined;
                
                if (typeof conn === 'object' && conn !== null && !Array.isArray(conn)) {
                  targetNodeName = (conn as { node?: string }).node;
                } else if (Array.isArray(conn) && conn.length > 0) {
                  // 数组格式：查找对应的节点
                  const targetNodeId = conn[0];
                  const targetNode = n8nWorkflow.nodes.find(n => n.id === targetNodeId);
                  targetNodeName = targetNode?.name;
                }

                if (targetNodeName) {
                  // 确保源节点和目标节点都存在
                  const sourceNode = rfNodes.find(n => n.id === sourceName);
                  const targetNode = rfNodes.find(n => n.id === targetNodeName);
                  
                  if (sourceNode && targetNode) {
                    rfEdges.push({
                      id: `e-${sourceName}-${targetNodeName}-${outputType}-${outputIndex}-${connIndex}`,
                      source: sourceName,
                      target: targetNodeName,
                      type: 'smoothstep', // 这种线型最像电路图
                      animated: false,
                      style: { stroke: '#9fa3f5', strokeWidth: 2 },
                      markerEnd: { type: MarkerType.ArrowClosed, color: '#9fa3f5' }, // 箭头
                    });
                  }
                }
              });
            }
          });
        }
      });
    });
  }

  return { nodes: rfNodes, edges: rfEdges };
};

// 简单的图标映射逻辑（适配暗色主题）
const getNodeIcon = (nodeType: string): string => {
  const typeLower = nodeType.toLowerCase();
  
  if (typeLower.includes('trigger') || typeLower.includes('manual')) return '🔘';
  if (typeLower.includes('webhook')) return '⚡';
  if (typeLower.includes('agent') || typeLower.includes('ai') || typeLower.includes('openai') || typeLower.includes('llm')) return '🤖';
  if (typeLower.includes('googlesheets') || typeLower.includes('spreadsheet')) return '📊';
  if (typeLower.includes('postgres') || typeLower.includes('database')) return '🐘';
  if (typeLower.includes('telegram')) return '✈️';
  if (typeLower.includes('gmail') || typeLower.includes('email')) return '📧';
  if (typeLower.includes('http') || typeLower.includes('request')) return '🌐';
  if (typeLower.includes('set') || typeLower.includes('code') || typeLower.includes('function')) return '⚙️';
  if (typeLower.includes('slack')) return '💬';
  if (typeLower.includes('notion')) return '📝';
  if (typeLower.includes('shopify')) return '🛒';
  
  return '📦'; // 默认图标
};

