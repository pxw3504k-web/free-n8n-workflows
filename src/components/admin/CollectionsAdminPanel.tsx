"use client";

import { useState } from "react";
import { CollectionData } from "@/lib/data";
import { useToast } from "@/contexts/ToastContext";

interface Props {
  initialCollections: CollectionData[];
}

export default function CollectionsAdminPanel({ initialCollections }: Props) {
  const [collections, setCollections] = useState<CollectionData[]>(initialCollections || []);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [adminSecret, setAdminSecret] = useState<string>('');
  const { showToast } = useToast();

  const setLoading = (id: string, v: boolean) => {
    setLoadingMap(prev => ({ ...prev, [id]: v }));
  };

  const handleGenerate = async (collectionId: string) => {
    setLoading(collectionId, true);
    try {
      const res = await fetch("/api/admin/generate-zip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret || "",
        },
        body: JSON.stringify({ collectionId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        const msg = data?.error || "Failed to generate ZIP";
        showToast(msg, "error");
        setLoading(collectionId, false);
        return;
      }

      // Update collection in UI
      setCollections(prev => prev.map(c => c.id === collectionId ? { ...c, zip_url: data.url } : c));
      showToast("ZIP generated & uploaded!", "success");
    } catch (e) {
      console.error("generate zip error", e);
      showToast("Failed to generate ZIP", "error");
    } finally {
      setLoading(collectionId, false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-300">Admin Secret:</label>
        <input
          className="px-2 py-1 rounded bg-[#0f1724] border border-white/10 text-sm text-gray-200"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          placeholder="Enter admin secret"
        />
        <div className="text-xs text-gray-500">This is required to call the admin API.</div>
      </div>

      <div className="overflow-x-auto rounded border border-white/10">
        <table className="min-w-full table-auto divide-y divide-white/5">
          <thead className="bg-[#0f1117]">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-400">Title</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400">Slug</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400">Zip Status</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#071028] divide-y divide-white/5">
            {collections.map((col) => (
              <tr key={col.id}>
                <td className="px-4 py-3 text-sm text-gray-100">{col.title}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{col.slug}</td>
                <td className="px-4 py-3 text-sm">
                  {col.zip_url ? (
                    <span className="text-green-400">✅ Ready</span>
                  ) : (
                    <span className="text-rose-400">❌ Missing</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    disabled={!!loadingMap[col.id]}
                    onClick={() => handleGenerate(col.id)}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-sm text-primary hover:bg-primary/20 disabled:opacity-60"
                  >
                    {loadingMap[col.id] ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : null}
                    <span>🔄 Generate ZIP</span>
                  </button>
                  {col.zip_url && (
                    <a
                      href={col.zip_url}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-3 text-xs text-gray-300 underline"
                    >
                      Open ZIP
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


