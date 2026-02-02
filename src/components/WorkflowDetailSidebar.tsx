"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Star, ShieldCheck, Eye, Link2, Copy } from 'lucide-react';
import { WorkflowData } from '@/lib/data';
import { MotionButton } from './ui/MotionButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { pickAuthorForId, DbAuthor, convertDbAuthorToAuthor } from '@/lib/authors';
import { formatAppName } from '@/lib/format';

interface IntegrationPair {
  slug: string;
  app_a: string;
  app_b: string;
  count: number;
}

interface WorkflowDetailSidebarProps {
  workflow: WorkflowData;
  relatedIntegrations?: IntegrationPair[];
  author?: DbAuthor | null;
}

export function WorkflowDetailSidebar({ workflow, relatedIntegrations = [], author }: WorkflowDetailSidebarProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const stats = typeof workflow.stats === 'string' ? JSON.parse(workflow.stats) : workflow.stats;

  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  
  // Use real author if available, otherwise fallback to fake author
  const assignedAuthor = author 
    ? convertDbAuthorToAuthor(author, 0)
    : pickAuthorForId(workflow.id || '');
  
  // Check if this is a real author (from database)
  const isRealAuthor = !!author;

  const [statsState, setStatsState] = useState(() => {
    // Normalize stars to 0-5 range (some legacy data might have values like 20)
    const rawStars = stats?.stars || 5;
    const normalizedStars = rawStars > 5 ? 5 : rawStars;
    
    return {
    views: stats?.views || 0,
    downloads: stats?.downloads || 0,
      stars: normalizedStars,
    };
  });
  const [submittingRating, setSubmittingRating] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  // ensure anon id exists (but do NOT write view events to DB to avoid load)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        let anon = localStorage.getItem('anon_id');
        if (!anon) {
          anon = crypto?.randomUUID ? crypto.randomUUID() : `anon-${Date.now()}`;
          localStorage.setItem('anon_id', anon);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDownload = async () => {
    if (!workflow.json_url) {
      alert(language === 'zh' ? '此工作流没有可用的 JSON URL。' : 'JSON URL not available for this workflow.');
      return;
    }

    setDownloading(true);
    try {
      // 使用 API 路由下载，添加防爬取保护
      const response = await fetch(`/api/workflow/download?slug=${encodeURIComponent(workflow.slug)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          alert(language === 'zh' ? '请求过于频繁，请稍后再试。' : 'Too many requests. Please try again later.');
        } else if (response.status === 403) {
          alert(language === 'zh' ? '访问被拒绝。' : 'Access denied.');
    } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const jsonData = await response.json();

      // 现在服务端已注入品牌便签（server-side injection），客户端不再重复注入
      const branded = jsonData;

      // 创建下载链接并触发下载（同步完成，之后再异步上报事件以避免阻塞 UI）
      const blob = new Blob([JSON.stringify(branded, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-${workflow.slug || workflow.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      try {
        trackEvent('download_workflow', { workflow_id: workflow.id, slug: workflow.slug });
      } catch {
        // ignore
      }

      // 立即结束下载状态并乐观更新本地下载数，避免等待后端完成导致长时间的“下载中”状态
      setDownloading(false);
      setStatsState(s => ({ ...s, downloads: s.downloads + 1 }));

      // 异步上报下载事件（后台发送，on-response 时再做合并更新）
      (async () => {
        try {
          const anon = typeof window !== 'undefined' ? localStorage.getItem('anon_id') : null;
          const resp = await fetch(`/api/workflow/${encodeURIComponent(workflow.slug)}/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'download', anon_id: anon }),
          });
          const dd = await resp.json();
          if (dd?.metrics) {
            const serverDownloads = typeof dd.metrics.downloads_count === 'number' ? dd.metrics.downloads_count : Number(dd.metrics.downloads_count);
            const newDownloads = Number.isFinite(serverDownloads)
              ? Math.max(serverDownloads, statsState.downloads + 1)
              : statsState.downloads + 1;

            setStatsState(s => ({
              ...s,
              downloads: newDownloads,
              stars: dd.metrics.average_rating ? Number(dd.metrics.average_rating) : s.stars,
            }));
          }
        } catch (e) {
          // ignore reporting errors
          console.warn('Background download event report failed', e);
        }
      })();
    } catch (error) {
      console.error('Download error:', error);
      alert(language === 'zh' ? '下载失败，请稍后再试。' : 'Download failed. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyJson = async () => {
    if (!workflow.json_url) {
      alert(language === 'zh' ? '此工作流没有可用的 JSON URL。' : 'JSON URL not available for this workflow.');
      return;
    }

    setCopying(true);
    try {
      // 使用 API 路由获取 JSON，添加防爬取保护
      const response = await fetch(`/api/workflow/download?slug=${encodeURIComponent(workflow.slug)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          alert(language === 'zh' ? '请求过于频繁，请稍后再试。' : 'Too many requests. Please try again later.');
        } else if (response.status === 403) {
          alert(language === 'zh' ? '访问被拒绝。' : 'Access denied.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const jsonData = await response.json();
      const jsonString = JSON.stringify(jsonData, null, 2);

      // 复制到剪贴板
      await navigator.clipboard.writeText(jsonString);

      // 显示成功提示
      alert(language === 'zh' ? 'JSON 已复制到剪贴板！' : 'JSON copied to clipboard!');

      try {
        trackEvent('copy_workflow_json', { workflow_id: workflow.id, slug: workflow.slug });
      } catch {
        // ignore
      }
    } catch (error) {
      console.error('Copy JSON error:', error);
      alert(language === 'zh' ? '复制失败，请稍后再试。' : 'Copy failed. Please try again later.');
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="space-y-6 sticky top-24">
      {/* Action Card */}
      <div id="get-this-workflow" className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">{language === 'zh' ? '获取此工作流' : 'Get This Workflow'}</h3>
        <div className="space-y-3">
          <MotionButton 
            className="w-full bg-primary hover:bg-primary-dark text-white h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            shine
            onClick={handleDownload}
            disabled={downloading || !workflow.json_url}
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {language === 'zh' ? '下载中...' : 'Downloading...'}
              </>
            ) : (
              <>
            <Download className="w-4 h-4 mr-2" />
                {language === 'zh' ? '免费下载 N8N JSON' : 'Free Download N8N JSON'}
              </>
            )}
          </MotionButton>

          {/* Copy JSON Button */}
          <MotionButton 
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={handleCopyJson}
            disabled={copying || !workflow.json_url}
          >
            {copying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {language === 'zh' ? '复制中...' : 'Copying...'}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {language === 'zh' ? '复制 JSON' : 'Copy JSON'}
              </>
            )}
          </MotionButton>
          
          {/* Share moved to header */}
          <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
            ID: {workflow.id.substring(0, 13)}...
          </p>
        </div>
      </div>

      {/* Author Card (assigned) */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">{language === 'zh' ? '关于作者' : 'About the Author'}</h3>
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={author?.avatar_url || `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(assignedAuthor.name)}`}
            alt={assignedAuthor.name}
            className="w-12 h-12 rounded-lg border border-white/10"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{assignedAuthor.name}</h4>
            <p className="text-xs text-gray-500">{assignedAuthor.role}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4">{assignedAuthor.bio}</p>
        <MotionButton 
          variant="secondary" 
          className="w-full border-white/10 text-xs h-9 rounded-lg hover:bg-white/5"
          onClick={() => {
            // Real author: jump to authors page
            if (isRealAuthor) {
              router.push('/authors');
            } else {
              // Fake author: open footer join-group modal
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open-join-qr'));
              }
            }
          }}
        >
          {language === 'zh' ? (isRealAuthor ? '查看作者' : '查看资料') : (isRealAuthor ? 'View Author' : 'View Profile')}
        </MotionButton>
      </div>

      {/* Stats Card */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">{language === 'zh' ? '统计数据' : 'Statistics'}</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center">
              <Eye className="w-4 h-4 mr-2" /> {language === 'zh' ? '浏览' : 'Views'}
            </span>
            <span className="text-sm font-bold text-white">{statsState.views}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center">
              <Download className="w-4 h-4 mr-2" /> {language === 'zh' ? '下载' : 'Downloads'}
            </span>
            <span className="text-sm font-bold text-white">{statsState.downloads}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 flex items-center">
              <Star className="w-4 h-4 mr-2" /> {language === 'zh' ? '评分' : 'Rating'}
            </span>
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-white">{statsState.stars ? (Math.round(statsState.stars * 10) / 10) : 5}/5</div>
              <div className="flex items-center">
                {[1,2,3,4,5].map((n) => (
                  <button
                    key={n}
                    onClick={async () => {
                      if (submittingRating) return;
                      setSubmittingRating(true);
                      try {
                        const anon = typeof window !== 'undefined' ? localStorage.getItem('anon_id') : null;
                        const res = await fetch(`/api/workflow/${encodeURIComponent(workflow.slug)}/rating`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ rating: n, anon_id: anon }),
                        });
                        const data = await res.json();
                        if (data?.metrics) {
                          setStatsState(s => {
                            // Normalize the rating to 0-5 range
                            const rawRating = Number(data.metrics.average_rating) || s.stars;
                            const normalizedRating = rawRating > 5 ? 5 : rawRating;
                            
                            return {
                            ...s,
                              stars: normalizedRating,
                            // optionally update counts
                            };
                          });
                          setUserRating(n);
                        }
                      } catch {
                        // ignore
                      } finally {
                        setSubmittingRating(false);
                      }
                    }}
                    className="p-1"
                    aria-label={`Rate ${n} stars`}
                  >
                    <Star className={`w-4 h-4 ${userRating && userRating >= n ? 'text-yellow-400' : 'text-gray-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification & Source Info */}
      {(workflow.is_verified || workflow.origin_source) && (
        <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">
            {language === 'zh' ? '认证信息' : 'Verification Info'}
          </h3>
          <div className="space-y-4">
            {workflow.is_verified && (
              <div className="flex items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <ShieldCheck className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-green-400">
                    {language === 'zh' ? '社区认证' : 'Community Verified'}
                  </div>
                  <div className="text-xs text-green-300/80">
                    {language === 'zh' ? '此工作流已通过社区审核' : 'This workflow has been verified by the community'}
                  </div>
                </div>
              </div>
            )}

            {workflow.origin_source && (
              <div className="flex items-start p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400 font-bold">📄</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-400 mb-1">
                    {language === 'zh' ? '来源' : 'Source'}
                  </div>
                  <div className="text-sm text-blue-300/90">
                    {workflow.origin_source}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Integrations Card */}
      {relatedIntegrations.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Link2 className="w-5 h-5 mr-2" />
            {language === 'zh' ? '相关集成组合' : 'Related Integrations'}
          </h3>
          <ul className="space-y-3">
            {relatedIntegrations.map((integration) => {
              const appAName = formatAppName(integration.app_a);
              const appBName = formatAppName(integration.app_b);
              const linkText = `${appAName} + ${appBName}`;
              
              return (
                <li key={integration.slug}>
                  <Link
                    href={`/integration/${integration.slug}`}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {linkText}
                    {integration.count > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({integration.count} {language === 'zh' ? '个工作流' : 'workflows'})
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/integration"
              className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              {language === 'zh' ? '查看所有集成' : 'View all integrations'}
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Custom Request Card */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2">
           <ShieldCheck className="w-5 h-5 text-primary/30" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{language === 'zh' ? '获取定制工作流' : 'Get Custom Workflow'}</h3>
        <p className="text-sm text-gray-400 mb-6">
          {language === 'zh' 
            ? '需要特定的自动化流程？我们的专家可以为您构建。'
            : 'Need a specific automation? Our experts can build it for you.'}
        </p>
        <ul className="space-y-2 mb-6">
           <li className="flex items-center text-xs text-gray-400">
             <ShieldCheck className="w-3.5 h-3.5 mr-2 text-primary" />
             {language === 'zh' ? '受顶级公司信赖' : 'Trusted by top companies'}
           </li>
           <li className="flex items-center text-xs text-gray-400">
             <ShieldCheck className="w-3.5 h-3.5 mr-2 text-primary" />
             {language === 'zh' ? '7+ 年经验' : '7+ years experience'}
           </li>
        </ul>
            <Link href="/custom-workflow">
        <MotionButton 
          className="w-full bg-white text-black hover:bg-gray-100 h-11 rounded-xl font-bold"
        >
                {language === 'zh' ? '请求定制' : 'Request Custom'}
        </MotionButton>
            </Link>
      </div>
    </div>
  );
}
