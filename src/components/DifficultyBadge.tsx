'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { WorkflowData } from '@/lib/data';
import { calculateNodeCount } from '@/lib/data';

interface DifficultyBadgeProps {
  workflow: WorkflowData;
  size?: 'sm' | 'md';
}

export function DifficultyBadge({ workflow, size = 'sm' }: DifficultyBadgeProps) {
  const [difficulty, setDifficulty] = useState<string>(workflow.difficulty || 'Beginner');

  useEffect(() => {
    // If difficulty is already set and valid, use it
    if (workflow.difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(workflow.difficulty)) {
      return;
    }

    // Calculate difficulty based on actual node count
    const calculateDifficulty = async () => {
      let nodeCount = workflow.node_count || 0;

      // If node_count is null or 0, try to calculate from JSON
      if (workflow.json_url && (!nodeCount || nodeCount === 0)) {
        try {
          nodeCount = await calculateNodeCount(workflow.json_url);
        } catch (error) {
          console.warn('Failed to calculate node count for difficulty:', error);
          nodeCount = workflow.node_count || 1; // fallback
        }
      }

      // Calculate difficulty based on node count
      let calculatedDifficulty: string;
      if (nodeCount < 12) {
        calculatedDifficulty = 'Beginner';
      } else if (nodeCount < 22) {
        calculatedDifficulty = 'Intermediate';
      } else {
        calculatedDifficulty = 'Advanced';
      }

      setDifficulty(calculatedDifficulty);
    };

    calculateDifficulty();
  }, [workflow.difficulty, workflow.node_count, workflow.json_url]);

  return (
    <span className={clsx(
      "rounded-md font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border",
      size === 'sm' && "px-2 py-1 text-[10px]",
      size === 'md' && "px-3 py-1 text-xs",
      difficulty === 'Beginner' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      difficulty === 'Intermediate' && "bg-amber-500/20 text-amber-400 border-amber-500/30",
      difficulty === 'Advanced' && "bg-rose-500/20 text-rose-400 border-rose-500/30",
      !difficulty && "bg-white/10 text-gray-300 border-white/20"
    )}>
      {difficulty || 'Beginner'}
    </span>
  );
}
