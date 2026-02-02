import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const lang = (searchParams.get("lang") || "en").toLowerCase();

    if (!q || q.length < 1) {
      return NextResponse.json([], { status: 200 });
    }

    const titleField = lang === "zh" ? "title_zh" : "title";

    // Basic fuzzy suggestion using ilike; limit results
    const ilikeQ = `%${q.replace(/%/g, "\\%")}%`;

    const { data, error } = await supabase
      .from("workflows")
      .select(`id, slug, ${titleField}`)
      .ilike(titleField, ilikeQ)
      .limit(8);

    if (error) {
      console.error("Suggest query error:", error);
      return NextResponse.json([], { status: 200 });
    }

    // Map to unified shape
    const results = (data || []).map((row: any) => ({
      id: row.id,
      title: row[titleField] || row.title || "",
      slug: row.slug,
    }));

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error("Suggest API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export const runtime = "nodejs";


