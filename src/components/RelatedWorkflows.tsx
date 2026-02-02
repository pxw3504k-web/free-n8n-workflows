"use client";

import Link from 'next/link';
import { WorkflowData } from '@/lib/data';
import { WorkflowCard } from './WorkflowCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface RelatedWorkflowsProps {
  workflows: WorkflowData[];
}

export function RelatedWorkflows({ workflows }: RelatedWorkflowsProps) {
  const { t, language } = useLanguage();

  if (!workflows || workflows.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {t('detail.relatedWorkflows')}
        </h2>
        <p className="text-gray-400 text-sm">
          {t('detail.relatedWorkflowsDescription')}
        </p>
          </div>
          <Link
            href="/"
            className="hidden md:flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary hover:text-primary-light transition-all text-sm font-medium"
          >
            {language === 'zh' ? '浏览全部 n8n 工作流' : 'Browse All n8n Workflows'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow, index) => (
          <WorkflowCard key={workflow.id} workflow={workflow} index={index} />
        ))}
      </div>

      {/* Mobile link */}
      <div className="md:hidden mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary hover:text-primary-light transition-all text-sm font-medium"
        >
          {language === 'zh' ? '浏览全部 n8n 工作流' : 'Browse All n8n Workflows'}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

