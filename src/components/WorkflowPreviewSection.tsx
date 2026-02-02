"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WorkflowData } from '@/lib/data';
import WorkflowViewer from './workflow/WorkflowViewer';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkflowPreviewSectionProps {
  workflow: WorkflowData;
}

export function WorkflowPreviewSection({ workflow }: WorkflowPreviewSectionProps) {
  const { language, t } = useLanguage();
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(null);
  const [loadingJson, setLoadingJson] = useState(!!workflow.json_url);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (workflow.json_url) {
      setJsonError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      fetch(`/api/workflow/download?slug=${encodeURIComponent(workflow.slug)}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      })
        .then(res => {
          clearTimeout(timeoutId);
          if (!res.ok) {
            if (res.status === 403) {
              throw new Error(language === 'zh' ? '访问被拒绝 (403)。请检查权限配置。' : 'Access Denied (403). Check permissions.');
            } else if (res.status === 404) {
              throw new Error(language === 'zh' ? '工作流 JSON 文件未找到 (404)。' : 'Workflow JSON file not found (404).');
            } else if (res.status === 429) {
              throw new Error(language === 'zh' ? '请求过于频繁，请稍后再试。' : 'Too many requests. Please try again later.');
            }
            throw new Error(language === 'zh' ? `无法获取 JSON: ${res.status} ${res.statusText}` : `Failed to fetch JSON: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          setJsonData(data);
        })
        .catch(err => {
          console.error('Error fetching workflow JSON:', err);
          setJsonError(err.message || (language === 'zh' ? '加载工作流 JSON 失败。' : 'Failed to load workflow JSON.'));
          setJsonData({
            nodes: [
              {
                parameters: {},
                id: '1',
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [250, 300],
              }
            ],
            connections: {}
          });
        })
        .finally(() => {
          setLoadingJson(false);
        });
    }
  }, [workflow.json_url, workflow.slug, language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] overflow-hidden shadow-xl">
        {loadingJson ? (
          <div className="h-[70vh] min-h-[600px] flex items-center justify-center bg-[#0a0a1e]">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">{t('detail.loadingPreview')}</p>
            </div>
          </div>
        ) : jsonError ? (
          <div className="h-[70vh] min-h-[600px] flex flex-col items-center justify-center bg-[#0a0a1e] p-6">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 border-2 border-yellow-500/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-yellow-500 text-xl">⚠️</span>
              </div>
              <p className="text-yellow-400 text-sm font-medium mb-2">{t('detail.failedToLoadJson')}</p>
              <p className="text-gray-500 text-xs mb-4">{jsonError}</p>
            </div>
          </div>
        ) : jsonData ? (
          <WorkflowViewer jsonData={jsonData} />
        ) : (
          <div className="h-[70vh] min-h-[600px] flex items-center justify-center bg-[#0a0a1e]">
            <p className="text-gray-500 text-sm">{t('detail.noPreviewData')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

