 "use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkflowRef {
  slug?: string;
  json_url?: string;
}

interface Props {
  collectionId: string;
  collectionSlug: string;
  zipUrl?: string | null;
  workflows: WorkflowRef[];
}

export default function CollectionZipButton({ collectionId, collectionSlug, zipUrl, workflows }: Props) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const isSubscribed = typeof window !== "undefined" && !!localStorage.getItem("is_subscribed");

  const handleClick = async () => {
    // Language-specific gating:
    // - zh: open join QR/modal (existing behavior)
    // - en: show email-gate modal if not subscribed, otherwise proceed
    if (!isSubscribed) {
      if (language === 'zh') {
        window.dispatchEvent(new Event("open-join-qr"));
        return;
      } else {
        setModalOpen(true);
        return;
      }
    }

    if (zipUrl) {
      // Prefer pre-built ZIP on GCS
      window.open(zipUrl, "_blank");
      return;
    }

    // Fallback: client-side fetch + zip
    setLoading(true);
    try {
      const zip = new JSZip();
      const fetches = workflows.map(async (w) => {
        const name = w.slug || "unknown";
        const url = w.json_url;
        if (!url) {
          zip.file(`${name}.json`, JSON.stringify({ error: "missing json_url" }));
          return;
        }
        try {
          const res = await fetch(url);
          if (!res.ok) {
            zip.file(`${name}.json`, JSON.stringify({ error: `fetch failed ${res.status}` }));
            return;
          }
          const text = await res.text();
          zip.file(`${name}.json`, text);
        } catch (e) {
          zip.file(`${name}.json`, JSON.stringify({ error: String(e) }));
        }
      });

      await Promise.all(fetches);
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${collectionSlug || collectionId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      showToast(t("collection.download.prepare") + " — " + t("collection.download.ready"), "success");
    } catch (e) {
      console.error("Fallback zip failed", e);
      showToast(t("collection.download.prepare") + "，请联系支持。", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const handleUnlockSubmit = async () => {
    if (!validateEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `collection:${collectionId}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.error || "Subscription failed", "error");
        return;
      }

      // mark subscribed locally and close modal, then trigger download
      localStorage.setItem("is_subscribed", "true");
      showToast(t("collection.download.prepare") + " — " + t("collection.download.ready"), "success");
      setModalOpen(false);

      // trigger download now
      if (zipUrl) {
        window.open(zipUrl, "_blank");
      } else {
        // trigger fallback
        await handleClick(); // will detect is_subscribed true and proceed to fallback
      }
    } catch (err) {
      console.error("subscribe error", err);
      showToast("Subscription failed, please try again.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : null}
        <span>{zipUrl ? "Download ZIP" : "Prepare & Download ZIP"}</span>
      </button>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-[#0f1724] border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">{t("collection.unlockTitle") || "Unlock Full Collection Download"}</h3>
            <p className="text-sm text-gray-400 mb-4">Enter your email to unlock the download.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mb-4 px-3 py-2 rounded bg-[#071028] border border-white/5 text-sm text-gray-200"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setModalOpen(false); }}
                className="px-3 py-2 rounded bg-transparent border border-white/10 text-sm text-gray-300 hover:bg-white/5"
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUnlockSubmit}
                className="px-3 py-2 rounded bg-primary text-white text-sm"
                disabled={submitLoading}
              >
                {submitLoading ? "..." : (t("collection.unlockButton") || "Unlock & Download")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


