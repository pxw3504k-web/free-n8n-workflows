'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowCard } from '@/components/WorkflowCard';
import { WorkflowData } from '@/lib/data';
import { Zap, ArrowRight } from 'lucide-react';

interface IntegrationDetailClientProps {
  appAName: string;
  appBName: string;
  count: number;
  aiDescription?: string;
  workflows: WorkflowData[];
}

export default function IntegrationDetailClient({
  appAName,
  appBName,
  count,
  aiDescription,
  workflows
}: IntegrationDetailClientProps) {
  const { t, language } = useLanguage();

  return (
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          {/* Integration Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {count} {language === 'zh' ? t('integration.detail.workflowsAvailable') : `Workflow${count !== 1 ? 's' : ''} Available`}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-6">
            {t('integration.detail.connect')}{' '}
            <span className="text-gradient bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {appAName}
            </span>
            {' '}{t('integration.detail.and')}{' '}
            <span className="text-gradient bg-gradient-to-r from-pink-400 via-purple-400 to-primary bg-clip-text text-transparent">
              {appBName}
            </span>
          </h1>

          {/* Description */}
          {aiDescription && (
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              {aiDescription}
            </p>
          )}

          {/* Visual Connector */}
          <div className="mt-8 flex items-center justify-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-xl">🔌</span>
              </div>
              <span className="text-sm font-medium">{appAName}</span>
            </div>
            
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{appBName}</span>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        {workflows.length > 0 ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                {t('integration.detail.availableWorkflows')}
              </h2>
              <span className="text-sm text-gray-500">
                {workflows.length} {language === 'zh' ? t('integration.detail.workflows') : `workflow${workflows.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow, index) => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Zap className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {t('integration.detail.noWorkflowsTitle')}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {t('integration.detail.noWorkflowsDesc')}{' '}
              <Link href="/submit" className="text-primary hover:underline">
                {t('integration.detail.submitYourOwn')}
              </Link>
              !
            </p>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-lg border border-white/10 bg-[#1a1a2e] p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              {t('integration.detail.aboutIntegration', { appA: appAName, appB: appBName })}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed mb-4">
                {t('integration.detail.aboutDesc', { appA: appAName, appB: appBName })}
              </p>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                {t('integration.detail.whyUseN8n', { appA: appAName, appB: appBName })}
              </h3>
              <ul className="space-y-2 text-gray-400 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>{t('integration.detail.noCodeSolution')}:</strong> {t('integration.detail.noCodeSolutionDesc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>{t('integration.detail.freeOpenSource')}:</strong> {t('integration.detail.freeOpenSourceDesc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>{t('integration.detail.readyTemplates')}:</strong> {t('integration.detail.readyTemplatesDesc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>{t('integration.detail.communitySupport')}:</strong> {t('integration.detail.communitySupportDesc')}</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                {t('integration.detail.gettingStartedTitle')}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {t('integration.detail.gettingStartedDesc', { appA: appAName, appB: appBName })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



