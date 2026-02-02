"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryItem {
  id: string;
  name: string;
  nameZh?: string;
  count: number;
  subtitle_en?: string;
  subtitle_zh?: string;
}

export default function CategoriesClient({ categories }: { categories: CategoryItem[] }) {
  const { language, t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold">{t("categories.title")}</h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">{t("categories.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const label = language === "zh" && cat.nameZh ? cat.nameZh : cat.name;
          return (
            <Link key={cat.id} href={`/?category=${encodeURIComponent(cat.id)}&page=1`} className="block">
              <div className="rounded-2xl border border-white/10 bg-[#0a0a1e] p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{label}</h3>
                  <p className="text-sm text-gray-400">{(language === "zh" ? (cat.subtitle_zh || cat.subtitle_en) : (cat.subtitle_en || cat.subtitle_zh)) || t("categories.cardDescription")}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <span>{cat.count} {t("categories.workflows")}</span>
                  <span className="text-primary">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


