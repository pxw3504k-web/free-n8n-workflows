"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
}

interface WorkflowFAQSectionProps {
  faqData: FAQItem[];
}

export function WorkflowFAQSection({ faqData }: WorkflowFAQSectionProps) {
  const { language } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    new Set([0, 1, 2]) // 默认展开前3个
  );

  if (!faqData || faqData.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-yellow-500 rounded-full mr-3" />
        <HelpCircle className="w-5 h-5 mr-2 text-yellow-500" />
        {language === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
      </h3>
      <div className="space-y-3">
        {faqData.map((faq, index) => {
          const isExpanded = expandedItems.has(index);
          return (
            <motion.div
              key={index}
              initial={false}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                aria-expanded={isExpanded}
              >
                <span className="text-base font-semibold text-white pr-4">
                  {faq.question}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
