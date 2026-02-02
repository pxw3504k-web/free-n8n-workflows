"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function CustomWorkflowForm() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    companyWebsite: '',
    email: '',
    budgetRange: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formData.email || !formData.budgetRange || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    // 验证消息长度
    if (formData.message.length < 10) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/custom-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // 重置表单
        setFormData({
          name: '',
          companyName: '',
          companyWebsite: '',
          email: '',
          budgetRange: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = formData.message.length;
  const minLength = 10;
  const maxLength = 2000;
  const isValidMessage = messageLength >= minLength && messageLength <= maxLength;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-20"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('custom.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('custom.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                {t('custom.name')} <span className="text-gray-500 text-xs">({t('custom.optional')})</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('custom.namePlaceholder')}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                {t('custom.companyName')} <span className="text-gray-500 text-xs">({t('custom.optional')})</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t('custom.companyNamePlaceholder')}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Company Website */}
            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-300 mb-2">
                {t('custom.companyWebsite')} <span className="text-gray-500 text-xs">({t('custom.optional')})</span>
              </label>
              <input
                type="url"
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder={t('custom.companyWebsitePlaceholder')}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t('custom.email')} <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('custom.emailPlaceholder')}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-300 mb-2">
                {t('custom.budgetRange')} <span className="text-red-400">*</span>
              </label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('custom.budgetRangePlaceholder')}</option>
                <option value="under-1k">{t('custom.budget.under1k')}</option>
                <option value="1k-5k">{t('custom.budget.1k5k')}</option>
                <option value="5k-10k">{t('custom.budget.5k10k')}</option>
                <option value="10k-25k">{t('custom.budget.10k25k')}</option>
                <option value="25k-50k">{t('custom.budget.25k50k')}</option>
                <option value="50k-plus">{t('custom.budget.50kPlus')}</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                {t('custom.message')} <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder={t('custom.messagePlaceholder')}
                className={`w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border ${
                  isValidMessage ? 'border-white/10' : 'border-red-500/50'
                } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none`}
              />
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className={`${isValidMessage ? 'text-gray-500' : 'text-red-400'}`}>
                  {messageLength}/{maxLength} {t('custom.characters')} {messageLength < minLength && `(${t('custom.minimum')} ${minLength})`}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValidMessage || !formData.email || !formData.budgetRange}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('custom.submitting')}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{t('custom.sendMessage')}</span>
                </>
              )}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                {t('custom.successMessage')}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {t('custom.errorMessage')}
              </div>
            )}

            {/* Response Time Note */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>{t('custom.responseTime')}</span>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

