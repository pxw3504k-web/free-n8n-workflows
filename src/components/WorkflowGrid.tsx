"use client";

import { WorkflowCard } from './WorkflowCard';
import { FeaturedDevCard } from './FeaturedDevCard';
import { WorkflowData } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';

interface WorkflowGridProps {
  workflows: WorkflowData[];
}

export function WorkflowGrid({ workflows }: WorkflowGridProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  
  // Only show Featured Card on first page and when no filters are applied
  const currentPage = parseInt(searchParams.get('page') || '1');
  const hasCategory = searchParams.get('category');
  const hasSort = searchParams.get('sort');
  const hasSearch = searchParams.get('search');
  
  const showFeaturedCard = currentPage === 1 && !hasCategory && !hasSort && !hasSearch;
  
  return (
    <div id="workflows-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Featured DEV Card - First position on homepage */}
      {showFeaturedCard && <FeaturedDevCard index={0} />}
      
      {/* Regular Workflow Cards */}
      {workflows.map((workflow, index) => (
        <WorkflowCard 
          key={workflow.id} 
          workflow={workflow} 
          index={showFeaturedCard ? index + 1 : index} 
        />
      ))}
      
      {workflows.length === 0 && (
        <div className="col-span-full py-20 text-center">
          <p className="text-gray-400">{t('search.noResults')}</p>
        </div>
      )}
    </div>
  );
}
