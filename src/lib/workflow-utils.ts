import { WorkflowData } from './data';
import { Language } from '@/contexts/LanguageContext';

/**
 * 根据语言获取工作流的标题
 */
export function getWorkflowTitle(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.title_zh) {
    return workflow.title_zh;
  }
  return workflow.title;
}

/**
 * 根据语言获取工作流的简短描述
 */
export function getWorkflowSummary(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.summary_short_zh) {
    return workflow.summary_short_zh;
  }
  return workflow.summary_short;
}

/**
 * 根据语言获取工作流的分类
 */
export function getWorkflowCategory(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.category_zh) {
    return workflow.category_zh;
  }
  return workflow.category;
}

/**
 * 根据语言获取工作流的标签
 */
export function getWorkflowTags(workflow: WorkflowData, language: Language): string[] {
  if (language === 'zh' && workflow.tags_zh && workflow.tags_zh.length > 0) {
    return workflow.tags_zh;
  }
  return workflow.tags || [];
}

/**
 * 根据语言获取工作流的概述（Markdown）
 */
export function getWorkflowOverview(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.overview_md_zh) {
    return workflow.overview_md_zh;
  }
  return workflow.overview_md || '';
}

/**
 * 根据语言获取工作流的功能（Markdown）
 */
export function getWorkflowFeatures(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.features_md_zh) {
    return workflow.features_md_zh;
  }
  return workflow.features_md || '';
}

/**
 * 根据语言获取工作流的使用案例（Markdown）
 */
export function getWorkflowUseCases(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.use_cases_md_zh) {
    return workflow.use_cases_md_zh;
  }
  return workflow.use_cases_md || '';
}

/**
 * 根据语言获取工作流的使用方法（Markdown）
 */
export function getWorkflowHowToUse(workflow: WorkflowData, language: Language): string {
  if (language === 'zh' && workflow.how_to_use_md_zh) {
    return workflow.how_to_use_md_zh;
  }
  return workflow.how_to_use_md || '';
}

