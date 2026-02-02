import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 配置运行时（Node.js runtime，支持 setInterval）
export const runtime = 'nodejs';

// 简单的内存限流（生产环境建议使用 Redis）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟
const RATE_LIMIT_MAX_REQUESTS = 10; // 每分钟最多10次请求

// 清理过期的限流记录（延迟初始化，避免在模块加载时执行）
let cleanupInterval: NodeJS.Timeout | null = null;

function initCleanupInterval() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000); // 每分钟清理一次
}

function getClientIp(request: NextRequest): string {
  // 尝试从各种头部获取真实 IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

function checkRateLimit(ip: string): boolean {
  // 初始化清理间隔
  initCleanupInterval();
  
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.resetTime < now) {
    // 创建新的限流记录
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // 超过限制
  }

  // 增加计数
  record.count++;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // 1. 检查 Referer（防止直接访问）
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // 允许来自同源的请求
    const allowedOrigins = host ? [
      `https://${host}`,
      `http://${host}`,
      `http://localhost:3000`,
      `http://127.0.0.1:3000`,
    ] : [
      `http://localhost:3000`,
      `http://127.0.0.1:3000`,
    ];
    
    // 检查 origin 或 referer
    const isValidOrigin = origin && allowedOrigins.some(allowed => origin.startsWith(allowed));
    const isValidReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed));
    
    // 开发环境允许直接访问（没有 origin/referer），生产环境需要验证
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment && !isValidOrigin && !isValidReferer) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid origin' },
        { status: 403 }
      );
    }

    // 2. Rate limiting
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 3. 获取工作流 ID 或 slug
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!workflowId && !slug) {
      return NextResponse.json(
        { error: 'Missing workflow ID or slug' },
        { status: 400 }
      );
    }

    // 4. 验证工作流是否存在并获取 json_url
    let query = supabase.from('workflows').select('json_url, id');
    
    if (workflowId) {
      query = query.eq('id', workflowId);
    } else if (slug) {
      query = query.eq('slug', slug);
    } else {
      return NextResponse.json(
        { error: 'Missing workflow ID or slug' },
        { status: 400 }
      );
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { 
          error: 'Workflow not found',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 404 }
      );
    }

    if (!data || !data.json_url) {
      console.error('Workflow data missing or json_url not available:', { data, workflowId, slug });
      return NextResponse.json(
        { error: 'Workflow JSON URL not available' },
        { status: 404 }
      );
    }

    // 5. 从 GCS 获取 JSON 文件
    const gcsResponse = await fetch(data.json_url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!gcsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch workflow JSON from storage' },
        { status: 502 }
      );
    }

    const jsonData = await gcsResponse.json();

    // Server-side 注入品牌便签（Sticky Note），避免客户端覆盖原有便签或依赖客户端注入
    const injectWatermarkServer = (originalData: unknown) => {
      try {
        if (!originalData || typeof originalData !== 'object') return originalData;
        const dataObj = originalData as Record<string, unknown>;

        // 找到节点容器：优先 top-level nodes，其次 workflow.nodes
        let nodes: Array<Record<string, unknown>> = [];
        let container: Record<string, unknown> | null = null;

        if (Array.isArray((dataObj as Record<string, unknown>)['nodes'])) {
          nodes = (dataObj as Record<string, unknown>)['nodes'] as Array<Record<string, unknown>>;
          container = dataObj;
        } else if ((dataObj as Record<string, unknown>)['workflow'] && Array.isArray(((dataObj as Record<string, unknown>)['workflow'] as Record<string, unknown>)['nodes'])) {
          const wf = ((dataObj as Record<string, unknown>)['workflow'] as Record<string, unknown>);
          nodes = (wf['nodes'] as Array<Record<string, unknown>>);
          container = wf;
        } else {
          // fallback: 建立 top-level nodes
          (dataObj as Record<string, unknown>)['nodes'] = [];
          nodes = ((dataObj as Record<string, unknown>)['nodes'] as Array<Record<string, unknown>>);
          container = dataObj;
        }

        // 计算最小 x,y（用于把便签放在最上方）
        let minX = Infinity;
        let minY = Infinity;
        for (const n of nodes) {
          if (!n || typeof n !== 'object') continue;
          const pos = (n as Record<string, unknown>)['position'];
          if (Array.isArray(pos) && pos.length >= 2) {
            const [x, y] = pos as [unknown, unknown];
            if (typeof x === 'number' && typeof y === 'number') {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
            }
          } else if (pos && typeof pos === 'object') {
            const posObj = pos as Record<string, unknown>;
            const px = typeof posObj['x'] === 'number' ? (posObj['x'] as number) : undefined;
            const py = typeof posObj['y'] === 'number' ? (posObj['y'] as number) : undefined;
            if (typeof px === 'number' && typeof py === 'number') {
              minX = Math.min(minX, px);
              minY = Math.min(minY, py);
            }
          }
        }
        if (minX === Infinity) minX = 0;
        if (minY === Infinity) minY = 0;

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.length > 0)
          ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
          : 'https://n8nworkflows.world';
        const brandingTitle = process.env.NEXT_PUBLIC_BRANDING_TITLE || '🚀 Downloaded from Free N8N';
        const brandingBody = process.env.NEXT_PUBLIC_BRANDING_BODY || 'Get 6000+ Free Workflows & Premium Support:';
        const brandingContent = `## ${brandingTitle}\n\n${brandingBody}\n\n${siteUrl}`;

        // 生成符合用户期望的 UUID（优先使用 crypto.randomUUID），若不可用则回退到 v4 样式伪随机 UUID
        const generateUuidV4 = (): string => {
          try {
            const globalCrypto = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
            if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
              return globalCrypto.randomUUID();
            }
          } catch {
            // ignore
          }
          // fallback: 生成 v4 风格的随机 UUID
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.floor(Math.random() * 16);
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        };

        const generatedId = generateUuidV4();

        // 选择注入位置：计算当前 JSON 的“最高点”（最小 y），并在其上方添加，确保不被遮挡
        // 找到所有节点的 y 最小值（考虑数组或对象位置表示）
        let highestY = Infinity;
        let leftMostX = Infinity;
        for (const n of nodes) {
          if (!n || typeof n !== 'object') continue;
          const pos = (n as Record<string, unknown>)['position'];
          if (Array.isArray(pos) && pos.length >= 2) {
            const y = pos[1];
            const x = pos[0];
            if (typeof y === 'number') highestY = Math.min(highestY, y);
            if (typeof x === 'number') leftMostX = Math.min(leftMostX, x);
          } else if (pos && typeof pos === 'object') {
            const y = (pos as Record<string, unknown>)['y'];
            const x = (pos as Record<string, unknown>)['x'];
            if (typeof y === 'number') highestY = Math.min(highestY, y);
            if (typeof x === 'number') leftMostX = Math.min(leftMostX, x);
          }
        }

        const stickyHeight = 200;
        const safeMargin = 120; // 保证与现有节点有间距
        const injectPosY = Number.isFinite(highestY) ? highestY - (stickyHeight + safeMargin) : -400;
        const injectPosX = Number.isFinite(leftMostX) ? leftMostX : (Number.isFinite(minX) ? minX : 0);

        const stickyNode = {
          id: generatedId,
          name: 'Sticky Note New',
          type: 'n8n-nodes-base.stickyNote',
          typeVersion: 1,
          position: [injectPosX, injectPosY],
          parameters: {
            height: stickyHeight,
            width: 400,
            color: 4,
            content: brandingContent,
          },
        };

        // 始终在服务端新增品牌便签（不替换或移除原有便签）
        let injected = false;
        if (container) {
          stickyNode.id = `free-n8n-sticky-${Date.now()}`;
          (container as Record<string, unknown>)['nodes'] = [stickyNode, ...nodes] as unknown;
          injected = true;
        }

        // 返回同时带上注入标志，便于调试（通过响应 header 可快速判断是否注入成功）
        (dataObj as Record<string, unknown>)['__branding_injected'] = injected;
        return dataObj;
      } catch (e) {
        console.error('injectWatermarkServer error', e);
        return originalData;
      }
    };

    const modified = injectWatermarkServer(jsonData);

    // 6. 返回 JSON 文件，设置适当的 headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="workflow-${data.id}.json"`,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    };
    try {
      const injectedFlag = ((modified as Record<string, unknown>)['__branding_injected'] as boolean) ? 'true' : 'false';
      headers['X-Branding-Injected'] = injectedFlag;
      if ((modified as Record<string, unknown>)['__branding_injected'] !== undefined) {
        // remove internal debug flag from payload
        delete (modified as Record<string, unknown>)['__branding_injected'];
      }
    } catch {}

    return NextResponse.json(modified, {
      headers,
    });
  } catch (error) {
    console.error('Error in workflow download API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

