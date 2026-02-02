 "use client";
 
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { trackEvent } from "@/lib/analytics";

export function SubmitWorkflowForm() {
  const { language, t } = useLanguage();
  void language;

  const [form, setForm] = useState({
    title: "",
    description: "",
    nodes: "",
    author_name: "",
    author_url: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null);
  const { showToast } = useToast();
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const clientValidate = (): { ok: boolean; errorKey?: string } => {
    if (!form.title || form.title.trim().length < 5) return { ok: false, errorKey: "submit.errors.titleTooShort" };
    if (!form.nodes || form.nodes.trim().length === 0) return { ok: false, errorKey: "submit.errors.nodesInvalid" };
    try {
      JSON.parse(form.nodes);
    } catch (err) {
      console.error('Invalid nodes JSON', err);
      return { ok: false, errorKey: "submit.errors.nodesInvalid" };
    }
    if (form.author_url && form.author_url.trim().length > 0) {
      try {
        const u = new URL(form.author_url);
        if (u.protocol !== "http:" && u.protocol !== "https:") return { ok: false, errorKey: "submit.errors.authorUrlInvalid" };
      } catch (err) {
        console.error('Invalid author URL', err);
        return { ok: false, errorKey: "submit.errors.authorUrlInvalid" };
      }
    }
    return { ok: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const valid = clientValidate();
    if (!valid.ok) {
      setStatus({ type: "error", message: t(valid.errorKey || "submit.errors.missingFields") });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/submit-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        try {
          trackEvent('submit_workflow', { title: form.title, author: form.author_name });
        } catch {}
        // Show success toast
        showToast(t("submit.success"), "success");
        // Clear form
        setForm({ title: "", description: "", nodes: "", author_name: "", author_url: "" });
        setUploadedFileName(null);
        // Redirect to home page after a short delay to show the toast
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        // map error codes to t keys
        const code = data?.errorCode;
        let key = "submit.errors.serverError";
        if (code === "title_too_short") key = "submit.errors.titleTooShort";
        if (code === "nodes_invalid_json" || code === "nodes_required") key = "submit.errors.nodesInvalid";
        if (code === "author_url_invalid") key = "submit.errors.authorUrlInvalid";
        showToast(t(key), "error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast(t("submit.errors.serverError"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    try {
      const text = await file.text();
      // ensure it's valid JSON: try parse
      JSON.parse(text);
      setForm(prev => ({ ...prev, nodes: text }));
    } catch (err) {
      console.error('File parse error', err);
      showToast(t("submit.errors.nodesInvalid"), "error");
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="rounded-xl border border-white/10 bg-[#0b0b1f] p-8">
        <h2 className="text-2xl font-bold text-white mb-2">{t("submit.title")}</h2>
        <p className="text-sm text-gray-400 mb-6">{t("submit.subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4" /> {t("custom.responseTime") ? t("custom.responseTime") : ""}
              </button>
            </div>
            <div />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("submit.form.title_label")}</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("submit.form.description_label")}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("submit.form.json_label")}</label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button type="button" onClick={openFilePicker} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-sm text-white">
                <UploadCloud className="w-5 h-5 text-white" /> <span>{t("submit.form.json_label")}</span>
              </button>
              <span className="text-xs text-gray-500">{uploadedFileName || ''}</span>
            </div>
            <textarea
              name="nodes"
              value={form.nodes}
              onChange={handleChange}
              rows={10}
              placeholder={t("submit.form.json_placeholder")}
              className="w-full mt-3 bg-transparent border border-white/10 rounded-md px-3 py-2 text-white font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">{t("submit.form.json_placeholder")}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("submit.form.author_name_label")}</label>
            <input
              name="author_name"
              value={form.author_name}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("submit.form.author_url_label")}</label>
            <input
              name="author_url"
              value={form.author_url}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white"
            />
            <p className="text-xs text-gray-500 mt-2">{t("submit.form.author_reward_hint")}</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {submitting ? t("custom.submitting") : t("submit.form.submit_btn")}
            </button>
          </div>

          {/* Inline status is replaced by site toast; keep small inline error as fallback */}
          {status && (
            <div className={`p-3 rounded-md ${status.type === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


