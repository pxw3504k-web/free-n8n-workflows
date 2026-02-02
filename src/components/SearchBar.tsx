"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  compact?: boolean;
  initialQuery?: string;
}

export default function SearchBar({ compact = false, initialQuery }: SearchBarProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id?: string; title: string; slug?: string }>>([]);
  const [isFocused, setIsFocused] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  // initialize from prop if provided
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);
  // Debounced suggestions fetch
  useEffect(() => {
    if (!query || query.length < 2) {
      // clear suggestions asynchronously to avoid synchronous state update in effect
      setTimeout(() => setSuggestions([]), 0);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}&lang=${language}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 6));
        } else if (Array.isArray(data.results)) {
          setSuggestions(data.results.slice(0, 6));
        }
      } catch (err: unknown) {
        // Safely extract name property if present
        let errName: string | undefined;
        if (err && typeof err === 'object' && 'name' in err) {
          errName = (err as { name?: unknown }).name as string | undefined;
        }
        if (errName === 'AbortError') return;
        console.error('Suggest fetch error', err);
      }
    }, 200);

    return () => {
      clearTimeout(id);
      // Abort the current controller if still present and clear reference
      if (controllerRef.current) {
        try {
          controllerRef.current.abort();
        } catch {
          // ignore abort errors
        }
        controllerRef.current = null;
      }
    };
  }, [query, language]);

  const submitSearch = (q?: string) => {
    const finalQuery = ((q ?? query) || "").trim();
    if (!finalQuery) return;
    // Navigate to search results page with query and language
    router.push(`/search?q=${encodeURIComponent(finalQuery)}&lang=${language}`);
  };

  return compact ? (
    <div className="relative flex items-center">
      <input
        aria-label={t("search.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitSearch();
        }}
        placeholder={t("search.placeholder")}
        className="h-10 w-full rounded-full border border-white/10 bg-[#0a0a1e]/50 px-3 pl-10 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon className="h-4 w-4" />
      </div>
      <button
        aria-label="Search"
        onClick={() => submitSearch()}
        className="ml-2 inline-flex items-center justify-center rounded-full bg-white/5 px-3 py-2 text-sm text-gray-200 hover:bg-white/10"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </div>
  ) : (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <input
          aria-label={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch();
          }}
          placeholder={t("search.placeholder")}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
        />

        <button
          onClick={() => submitSearch()}
          className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:from-pink-600 hover:to-purple-700"
        >
          {t("search.button") || "AI Search"}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 z-20 rounded-lg border border-white/10 bg-[#0a0a1e] p-2 shadow-xl">
          {suggestions.map((sugg) => (
            <div
              key={sugg.id ?? sugg.title}
              onMouseDown={(e) => {
                // prevent blur before click
                e.preventDefault();
                if (sugg.slug) {
                  router.push(`/workflow/${sugg.slug}`);
                } else {
                  submitSearch(sugg.title);
                }
              }}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
            >
              {sugg.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

 