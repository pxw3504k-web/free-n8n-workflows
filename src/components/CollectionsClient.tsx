"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { CollectionData } from "@/lib/data";
import { Star } from "lucide-react";

export default function CollectionsClient({ collections }: { collections: CollectionData[] }) {
  const { language, t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold">{t("collections.title")}</h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">{t("collections.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map(collection => {
          const title = language === "zh" && collection.title_zh ? collection.title_zh : collection.title;
          const description = language === "zh" && collection.description_zh ? collection.description_zh : collection.description;
          const workflowCount = collection.workflow_count || 0;

          return (
            <Link key={collection.id} href={`/collection/${collection.slug}`} className="block">
              <div className="rounded-2xl border border-white/10 bg-[#0a0a1e] p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {collection.icon && (
                        <div className="w-8 h-8 mr-3 rounded-lg bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-sm">{collection.icon}</span>
                        </div>
                      )}
                      {collection.is_featured && (
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="text-xs">{t("collections.featured")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{description || t("collections.cardDescription")}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <span>{workflowCount} {t("collections.workflows")}</span>
                  <span className="text-primary">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">{t("search.noResults")}</p>
        </div>
      )}
    </div>
  );
}


