/**
 * Type definitions for Supabase database tables and integration pairs
 */

/**
 * IntegrationPair represents a combination of two apps/integrations
 * Used for SEO combination pages
 */
export interface IntegrationPair {
  /** Index identifier */
  idx: number;
  
  /** URL-friendly slug for the integration pair page */
  slug: string;
  
  /** First app/integration identifier */
  app_a: string;
  
  /** Second app/integration identifier */
  app_b: string;
  
  /** 
   * Array of workflow IDs that use this integration pair
   * Can be either a string[] (parsed) or string (raw JSONB from database)
   */
  workflow_ids: string[] | string;
  
  /** Number of workflows using this integration pair */
  count: number;
  
  /** AI-generated description for the integration pair */
  ai_description: string;
  
  /** Timestamp of last update */
  updated_at: string;
}

/**
 * Helper type for parsed IntegrationPair with workflow_ids always as array
 */
export interface ParsedIntegrationPair extends Omit<IntegrationPair, 'workflow_ids'> {
  workflow_ids: string[];
}

/**
 * Utility function to parse IntegrationPair workflow_ids
 * Converts string JSON to array if needed
 */
export function parseIntegrationPair(pair: IntegrationPair): ParsedIntegrationPair {
  return {
    ...pair,
    workflow_ids: typeof pair.workflow_ids === 'string' 
      ? JSON.parse(pair.workflow_ids) 
      : pair.workflow_ids,
  };
}



