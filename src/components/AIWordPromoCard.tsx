"use client";

import { motion } from "framer-motion";
import { Check, Cloud, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIWordPromoCardProps {
  targetUrl?: string;
  mode?: 'sidebar' | 'inline';
  customBody?: string; // Custom body text for inline mode
}

export function AIWordPromoCard({ 
  targetUrl = 'https://aiword.life/automations',
  mode = 'sidebar',
  customBody
}: AIWordPromoCardProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const content = {
    header: isZh ? '🚀 不想配置 n8n 服务器？' : '🚀 Run Without Servers',
    body: customBody || (isZh 
      ? '使用我们的托管 AI 自动化云服务。无需 DevOps，零错误。免费开始。'
      : 'Use our managed AI Automation Cloud. No DevOps, no errors. Start for free.'),
    features: isZh
      ? ['反检测浏览器', '托管代理', '24/7 运行']
      : ['Anti-detect Browser', 'Managed Proxies', '24/7 Uptime'],
    cta: isZh ? '在 AIWord 云上运行 ☁️' : 'Run on AIWord Cloud ☁️',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        mode === 'inline' ? 'w-full' : ''
      }`}
    >
      {/* AI Chip Badge - Top Right */}
      <div className="absolute right-4 top-4 opacity-60">
        <Cpu className="h-6 w-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 text-white">
        {/* Header */}
        <h3 className="text-lg font-bold leading-tight pr-8">
          {content.header}
        </h3>

        {/* Body */}
        <p className="text-sm leading-relaxed text-white/90">
          {content.body}
        </p>

        {/* Feature List - Only for Sidebar Mode */}
        {mode === 'sidebar' && (
          <ul className="flex flex-col gap-2">
            {content.features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-2 text-xs text-white/90"
              >
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <motion.a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-gray-900 shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg"
        >
          <Cloud className="h-4 w-4" />
          {content.cta}
        </motion.a>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 pointer-events-none" />
    </motion.div>
  );
}
