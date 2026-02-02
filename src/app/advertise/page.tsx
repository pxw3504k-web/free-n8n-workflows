"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { motion } from 'framer-motion';
import { Server, Users, Code } from 'lucide-react';

export default function AdvertisePage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [getStartedForm, setGetStartedForm] = useState({
    name: '',
    workEmail: '',
    website: '',
    message: '',
  });
  const [isSubmittingGetStarted, setIsSubmittingGetStarted] = useState(false);
  const [getStartedStatus, setGetStartedStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/advertise/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
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

  const scrollToContact = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGetStartedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGetStartedForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGetStartedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!getStartedForm.workEmail || !getStartedForm.message) {
      setGetStartedStatus('error');
      return;
    }

    // 验证消息长度
    if (getStartedForm.message.length < 10 || getStartedForm.message.length > 2000) {
      setGetStartedStatus('error');
      return;
    }

    setIsSubmittingGetStarted(true);
    setGetStartedStatus('idle');

    try {
      const response = await fetch('/api/advertise/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: getStartedForm.name || null,
          email: getStartedForm.workEmail,
          company_name: null,
          company_website: getStartedForm.website || null,
          budget_range: 'under-1k', // 默认值，因为必填
          message: getStartedForm.message, // 用于 message 字段（必填）
          admin_notes: getStartedForm.message, // 用户输入的 message 也存到 admin_notes
        }),
      });

      if (response.ok) {
        setGetStartedStatus('success');
        showToast(t('advertise.getStarted.form.success'), 'success');
        setGetStartedForm({
          name: '',
          workEmail: '',
          website: '',
          message: '',
        });
      } else {
        const data = await response.json();
        console.error('Submit error:', data);
        setGetStartedStatus('error');
        showToast(t('advertise.contact.error'), 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setGetStartedStatus('error');
      showToast(t('advertise.contact.error'), 'error');
    } finally {
      setIsSubmittingGetStarted(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
          
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                {t('advertise.heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                {t('advertise.heroSubtitle')}
              </p>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
              >
                {t('advertise.ctaButton')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10k+</div>
                <div className="text-sm text-gray-400">{t('advertise.stats.monthlyViews')}</div>
              </div>
              <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-sm text-gray-400">{t('advertise.stats.workflowDownloads')}</div>
              </div>
              <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Devs</div>
                <div className="text-sm text-gray-400">{t('advertise.stats.audienceType')}</div>
              </div>
              <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4m 30s</div>
                <div className="text-sm text-gray-400">{t('advertise.stats.avgTimeOnSite')}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Audience Profile Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('advertise.audience.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Self-Hosters & SysAdmins */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Server className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('advertise.audience.selfHosters.title')}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {t('advertise.audience.selfHosters.desc')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* SaaS Founders & CTOs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('advertise.audience.founders.title')}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {t('advertise.audience.founders.desc')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Automation Engineers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Code className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('advertise.audience.engineers.title')}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {t('advertise.audience.engineers.desc')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sponsorship Options Section */}
        <section className="py-16 px-4 bg-[#0a0a1e]">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('advertise.sponsorship.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Sponsored Workflow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('advertise.sponsorship.workflow.title')}
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 flex-1 leading-relaxed">
                  {t('advertise.sponsorship.workflow.desc')}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-primary font-medium">
                    {t('advertise.sponsorship.workflow.bestFor')}
                  </p>
                </div>
              </motion.div>

              {/* Site-Wide Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <span className="text-3xl">🖼️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('advertise.sponsorship.banner.title')}
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 flex-1 leading-relaxed">
                  {t('advertise.sponsorship.banner.desc')}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-primary font-medium">
                    {t('advertise.sponsorship.banner.bestFor')}
                  </p>
                </div>
              </motion.div>

              {/* Newsletter/Content Shoutout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('advertise.sponsorship.content.title')}
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 flex-1 leading-relaxed">
                  {t('advertise.sponsorship.content.desc')}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-primary font-medium">
                    {t('advertise.sponsorship.content.bestFor')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  {t('advertise.contact.title')}
                </h2>
                <p className="text-gray-400">
                  {t('advertise.contact.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('advertise.contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder={t('advertise.contact.name')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('advertise.contact.email')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('advertise.contact.company')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder={t('advertise.contact.company')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('advertise.contact.message')} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder={t('advertise.contact.message')}
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    {t('advertise.contact.success')}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {t('advertise.contact.error')}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('advertise.contact.submitting')}</span>
                    </>
                  ) : (
                    <span>{t('advertise.contact.submit')}</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="py-16 px-4 bg-[#0f0f1a]">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('advertise.getStarted.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-lg text-gray-300 leading-relaxed">
                  {t('advertise.getStarted.text')}
                </p>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Contact us directly:</p>
                  <a
                    href={`mailto:${t('advertise.getStarted.contactEmail')}`}
                    className="text-primary hover:text-primary/80 text-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    {t('advertise.getStarted.contactEmail')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* Right: Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 md:p-8"
              >
                <form onSubmit={handleGetStartedSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="getStarted-name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('advertise.getStarted.form.name')}
                    </label>
                    <input
                      type="text"
                      id="getStarted-name"
                      name="name"
                      value={getStartedForm.name}
                      onChange={handleGetStartedChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder={t('advertise.getStarted.form.name')}
                    />
                  </div>

                  {/* Work Email */}
                  <div>
                    <label htmlFor="getStarted-workEmail" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('advertise.getStarted.form.workEmail')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="getStarted-workEmail"
                      name="workEmail"
                      value={getStartedForm.workEmail}
                      onChange={handleGetStartedChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>

                  {/* Website URL */}
                  <div>
                    <label htmlFor="getStarted-website" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('advertise.getStarted.form.website')}
                    </label>
                    <input
                      type="url"
                      id="getStarted-website"
                      name="website"
                      value={getStartedForm.website}
                      onChange={handleGetStartedChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="getStarted-message" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('advertise.getStarted.form.message')} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="getStarted-message"
                      name="message"
                      value={getStartedForm.message}
                      onChange={handleGetStartedChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0a1e] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      placeholder={t('advertise.getStarted.form.message')}
                    />
                  </div>

                  {/* Status Messages */}
                  {getStartedStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      {t('advertise.contact.success')}
                    </div>
                  )}
                  {getStartedStatus === 'error' && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {t('advertise.contact.error')}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingGetStarted}
                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingGetStarted ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('advertise.getStarted.form.submitting')}</span>
                      </>
                    ) : (
                      <span>{t('advertise.getStarted.form.submit')}</span>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
