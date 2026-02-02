'use client';

import { useState, useEffect } from 'react';
import { calculateNodeCount } from '@/lib/data';

interface NodeCountProps {
  jsonUrl?: string;
  fallbackCount?: number;
  className?: string;
}

export function NodeCount({ jsonUrl, fallbackCount = 0, className = '' }: NodeCountProps) {
  const [nodeCount, setNodeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jsonUrl || nodeCount !== null) return;

    const fetchNodeCount = async () => {
      setLoading(true);
      try {
        const count = await calculateNodeCount(jsonUrl);
        setNodeCount(count > 0 ? count : fallbackCount);
      } catch (error) {
        console.warn('Failed to calculate node count:', error);
        setNodeCount(fallbackCount);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to avoid too many simultaneous requests
    const timeoutId = setTimeout(fetchNodeCount, Math.random() * 100);

    return () => clearTimeout(timeoutId);
  }, [jsonUrl, fallbackCount, nodeCount]);

  if (loading) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{nodeCount || fallbackCount}</span>;
}
