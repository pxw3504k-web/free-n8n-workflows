import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { WorkflowCard } from '@/components/WorkflowCard';
import { WorkflowData, enrichWorkflowData } from '@/lib/data';
import { ChevronRight } from 'lucide-react';
import { TrendingDescription } from './TrendingDescription';

export async function TrendingRow() {
  // Try to fetch trending workflows using the dynamic RPC function
  // Fetch more than needed to allow for randomization and filtering
  let { data, error } = await supabase.rpc('get_weekly_trending_dynamic', { 
    limit_count: 50 
  });

  // Fallback: if RPC function doesn't exist, use direct query
  if (error) {
    console.warn('RPC function not available, using fallback query:', error);
    const fallbackResult = await supabase
      .from('workflows')
      .select('*')
      .eq('is_verified', true)
      .order('stats->downloads', { ascending: false })
      .limit(50);
    
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  // If no data or error, don't render anything
  if (error || !data || data.length === 0) {
    console.error('Error fetching trending workflows:', error);
    return null;
  }

  // Note: RPC function now filters for is_verified = true at database level
  // But we still filter here as a safety check (in case RPC function hasn't been updated yet)
  const verifiedWorkflows = data.filter((workflow: WorkflowData) => workflow.is_verified === true);
  
  // If no verified workflows, don't render anything
  if (verifiedWorkflows.length === 0) {
    return null;
  }

  // Enrich workflow data with additional computed fields
  const enrichedWorkflows = verifiedWorkflows.map(enrichWorkflowData);

  // 🎲 Daily randomization: Use current date as seed for consistent daily results
  // This ensures the same workflows are shown throughout the day (cache-friendly)
  // but different workflows appear each day
  const now = new Date();
  const dateSeed = now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
  
  // Fisher-Yates shuffle with date-based seed
  const shuffled = [...enrichedWorkflows];
  let random = dateSeed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Simple LCG (Linear Congruential Generator) for pseudo-random numbers
    random = (random * 1103515245 + 12345) & 0x7fffffff;
    const j = random % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Take top 6 workflows after randomization
  const workflows = shuffled.slice(0, 6);

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">🔥</span>
          <span>Trending Now</span>
        </h2>
        <Link 
          href="/leaderboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
        >
          <span>View Top 100</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <TrendingDescription />
      </div>

      {/* Horizontal Scrolling Container - Netflix Style */}
      <div 
        className="overflow-x-auto snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex gap-6 pb-4">
          {workflows.map((workflow, index) => (
            <div 
              key={workflow.id} 
              className="snap-center flex-shrink-0 w-[280px] md:w-[320px]"
            >
              <WorkflowCard workflow={workflow} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Hint for Mobile */}
      <div className="mt-2 text-center md:hidden">
        <p className="text-xs text-gray-500">← Swipe to see more →</p>
      </div>
    </section>
  );
}

