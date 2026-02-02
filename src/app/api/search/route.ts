import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { expandSearchQuery } from "@/lib/searchKeywords";

// Simple in-memory cache & analytics for search queries.
// Note: this is fine for development. For production use Redis or another external cache.
type CacheEntry = { ts: number; data: any };
const SEARCH_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60s

// Basic in-memory popular query counter
const POPULAR_QUERIES = new Map<string, number>();

// Periodic cleanup of old cache entries
let cleanupTimer: NodeJS.Timeout | null = null;
function initCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of SEARCH_CACHE.entries()) {
      if (entry.ts + CACHE_TTL_MS < now) {
        SEARCH_CACHE.delete(key);
      }
    }
  }, 30 * 1000);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const lang = (searchParams.get("lang") || "en").toLowerCase();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || "Most Popular";

    const offset = (Math.max(page, 1) - 1) * limit;
    initCleanup();

    // Build a cache key for this query
    const cacheKey = [`q:${q || ''}`, `lang:${lang}`, `page:${page}`, `limit:${limit}`, `cat:${category || ''}`, `sort:${sort}`].join('|');
    const now = Date.now();
    const cached = SEARCH_CACHE.get(cacheKey);
    if (cached && (cached.ts + CACHE_TTL_MS) > now) {
      // update popularity metric for cached queries too
      if (q) {
        POPULAR_QUERIES.set(q, (POPULAR_QUERIES.get(q) || 0) + 1);
      }
      return NextResponse.json(cached.data);
    }

    // Choose fields to search based on language preference
    const titleField = lang === "zh" ? "title_zh" : "title";
    const summaryField = lang === "zh" ? "summary_short_zh" : "summary_short";

    let query = supabase
      .from("workflows")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    // Filter by category if provided (exact match)
    if (category) {
      query = query.eq("category", category);
    }

    // Enhanced search with natural language keyword expansion
    if (q) {
      // 扩展搜索关键词（自然语言映射）
      const expandedKeywords = expandSearchQuery(q);
      
      // 构建搜索模式数组
      const patterns: string[] = [];
      const safeQ = q.replace(/%/g, "\\%");
      
      // 原始查询匹配（优先级最高）
      patterns.push(`${titleField}.ilike.%${safeQ}%`);
      patterns.push(`${summaryField}.ilike.%${safeQ}%`);
      
      // 扩展关键词匹配
      expandedKeywords.forEach(keyword => {
        const safeKeyword = keyword.replace(/%/g, "\\%");
        patterns.push(`${titleField}.ilike.%${safeKeyword}%`);
        patterns.push(`${summaryField}.ilike.%${safeKeyword}%`);
        patterns.push(`overview_md.ilike.%${safeKeyword}%`);
        patterns.push(`features_md.ilike.%${safeKeyword}%`);
        // 匹配 tags 数组（使用 cs 操作符）
        patterns.push(`tags.cs.{${keyword}}`);
      });
      
      // 如果语言是中文，也搜索中文字段
      if (lang === "zh") {
        const zhTitleField = "title_zh";
        const zhSummaryField = "summary_short_zh";
        patterns.push(`${zhTitleField}.ilike.%${safeQ}%`);
        patterns.push(`${zhSummaryField}.ilike.%${safeQ}%`);
        
        expandedKeywords.forEach(keyword => {
          const safeKeyword = keyword.replace(/%/g, "\\%");
          patterns.push(`${zhTitleField}.ilike.%${safeKeyword}%`);
          patterns.push(`${zhSummaryField}.ilike.%${safeKeyword}%`);
          patterns.push(`overview_md_zh.ilike.%${safeKeyword}%`);
          patterns.push(`features_md_zh.ilike.%${safeKeyword}%`);
          patterns.push(`tags_zh.cs.{${keyword}}`);
        });
      }
      
      // 使用 OR 连接所有模式
      const orExpr = patterns.join(',');
      query = query.or(orExpr);
    }

    // Sort handling (fallback to created_at)
    if (sort === "Newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      // Most Popular or Trending: fallback to created_at desc (popularity scoring will be added later)
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;
    const durationMs = Date.now() - now;
    // Log slow queries
    if (durationMs > 200) {
      console.warn(`Slow search query (${durationMs}ms):`, { q, lang, page, limit, category, sort });
    }

    const responsePayload = {
      data: data || [],
      count: typeof count === "number" ? count : null,
      page,
      limit,
    };

    // Cache response
    SEARCH_CACHE.set(cacheKey, { ts: Date.now(), data: responsePayload });

    // Track popular queries (simple counter)
    if (q) {
      POPULAR_QUERIES.set(q, (POPULAR_QUERIES.get(q) || 0) + 1);
    }

    if (error) {
      console.error("Search query error:", error);
      return NextResponse.json({ error: "Search query failed" }, { status: 500 });
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";


