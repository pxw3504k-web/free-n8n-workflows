 "use client";

import { motion } from "framer-motion";
import { MotionButton } from "./ui/MotionButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

export function Newsletter() {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Chinese users prefer WeChat public account instead of email subscription
  if (language === "zh") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-100">
            {t("newsletter.title")}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {t("newsletter.description")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <img
            src="https://storage.googleapis.com/aiseo-image/images/static/qrcode_for_gh_4e00d2fb9faa_344.jpg"
            alt="WeChat Public Account"
            className="w-28 h-28 rounded-md border border-white/10"
          />
          <div>
            <p className="text-sm text-gray-200">{t("newsletter.follow")}</p>
            <p className="text-xs text-gray-400 mt-2">扫码关注公众号获取最新更新</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-100">
          {t("newsletter.title")}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          {t("newsletter.description")}
        </p>
      </div>
      <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 w-full rounded-md border border-white/10 bg-[#1a1a2e] px-3 py-1 text-sm text-gray-100 shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
        <MotionButton
          variant="primary"
          size="sm"
          className="w-full"
          shine
          onClick={async () => {
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              showToast("Please enter a valid email address.", "error");
              return;
            }
            setLoading(true);
            try {
              const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "newsletter_footer" }),
              });
              const data = await res.json();
              if (!res.ok) {
                showToast(data?.error || "Subscription failed", "error");
              } else {
                localStorage.setItem("is_subscribed", "true");
                showToast("Subscribed — check your inbox for the Top 5 workflows", "success");
                setEmail('');
              }
            } catch (err) {
              console.error("subscribe error", err);
              showToast("Subscription failed, please try again.", "error");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "..." : "Get the Top 5 n8n workflows of the week"}
        </MotionButton>
      </form>
    </motion.div>
  );
}
