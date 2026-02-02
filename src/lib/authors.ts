import { supabase } from './supabase';
import { unstable_cache } from 'next/cache';

export type Author = {
  name: string;
  name_zh?: string;
  handle: string;
  role: string;
  bio: string;
  bio_zh?: string;
  count: number;
  joined: string;
  color: string;
};

// Database author type
export type DbAuthor = {
  id: string;
  name: string;
  name_zh?: string | null;
  slug: string;
  youtube_url: string | null;
  website_url: string | null;
  avatar_url: string | null;
  workflow_count: number | null;
  bio_zh?: string | null;
  created_at: string;
};

export const FAKE_AUTHORS: Author[] = [
  {
    name: "Free n8n Workflows Official",
    handle: "@ay_official",
    role: "System Admin",
    bio: "The official repository for verified enterprise-grade workflows.",
    count: 3200,
    joined: "2024-01-01",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "DevOps_Master_X",
    handle: "@devops_x",
    role: "Infrastructure Expert",
    bio: "Specializing in CI/CD pipelines, Docker, and Kubernetes automations.",
    count: 1250,
    joined: "2024-03-15",
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    name: "AI_Workflow_Bot",
    handle: "@ai_agent_007",
    role: "LLM Specialist",
    bio: "Building complex chains with OpenAI, Claude, and LangChain.",
    count: 880,
    joined: "2024-05-20",
    color: "bg-green-500/10 text-green-400",
  },
  {
    name: "SaaS_Connector",
    handle: "@api_wizard",
    role: "Integration Guru",
    bio: "Connecting CRM, Notion, and Slack to automate your life.",
    count: 500,
    joined: "2024-06-10",
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    name: "Crypto_Watcher",
    handle: "@chain_link",
    role: "Web3 Developer",
    bio: "Automated trading bots and blockchain monitoring workflows.",
    count: 200,
    joined: "2024-07-01",
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    name: "N8N_Community_Pick",
    handle: "@community_best",
    role: "Curator",
    bio: "Hand-picked high quality workflows from the global community.",
    count: 58,
    joined: "2024-08-01",
    color: "bg-yellow-500/10 text-yellow-400",
  },
];

// Deterministic pick based on workflow id
export function pickAuthorForId(id: string) {
  if (!id) return FAKE_AUTHORS[0];
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum = (sum * 31 + id.charCodeAt(i)) >>> 0;
  const idx = sum % FAKE_AUTHORS.length;
  return FAKE_AUTHORS[idx];
}

// Get all authors from database
export const getAuthors = unstable_cache(
  async (): Promise<DbAuthor[]> => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('workflow_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching authors:', error);
        return [];
      }

      return (data || []) as DbAuthor[];
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return [];
    }
  },
  ['authors-list'],
  { revalidate: 3600, tags: ['authors'] }
);

// Get author by ID (for workflow author lookup)
export async function getAuthorById(id: string): Promise<DbAuthor | null> {
  if (!id || !id.trim()) return null;
  
  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id.trim())
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        // PGRST116 is "not found", which is fine
        console.error('[getAuthorById] Error fetching author by id:', error);
      }
      return null;
    }

    return data as DbAuthor;
  } catch (error) {
    console.error('[getAuthorById] Error in getAuthorById:', error);
    return null;
  }
}

// Get author by name (for workflow author lookup)
// Note: This function cannot use unstable_cache with dynamic name parameter
// Instead, we'll cache at the component level or use a different approach
export async function getAuthorByName(name: string): Promise<DbAuthor | null> {
  if (!name || !name.trim()) return null;
  
  const trimmedName = name.trim();
  console.log(`[getAuthorByName] Searching for author: "${trimmedName}"`);
  
  try {
    // Try exact match first (case-insensitive)
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .ilike('name', trimmedName)
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found", which is fine
      console.error('[getAuthorByName] Error fetching author by name:', error);
    }

    if (data && data.length > 0) {
      console.log(`[getAuthorByName] Found author by name match: ${data[0].name}`);
      return data[0] as DbAuthor;
    }

    // Try slug match
    const slug = trimmedName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    console.log(`[getAuthorByName] Trying slug match: "${slug}"`);
    
    const { data: slugData, error: slugError } = await supabase
      .from('authors')
      .select('*')
      .eq('slug', slug)
      .limit(1);

    if (slugError && slugError.code !== 'PGRST116') {
      console.error('[getAuthorByName] Error fetching author by slug:', slugError);
    }

    if (slugData && slugData.length > 0) {
      console.log(`[getAuthorByName] Found author by slug match: ${slugData[0].name}`);
      return slugData[0] as DbAuthor;
    }

    // Try partial match (contains)
    console.log(`[getAuthorByName] Trying partial match for: "${trimmedName}"`);
    const { data: partialData, error: partialError } = await supabase
      .from('authors')
      .select('*')
      .ilike('name', `%${trimmedName}%`)
      .limit(1);

    if (partialError && partialError.code !== 'PGRST116') {
      console.error('[getAuthorByName] Error fetching author by partial match:', partialError);
    }

    if (partialData && partialData.length > 0) {
      console.log(`[getAuthorByName] Found author by partial match: ${partialData[0].name}`);
      return partialData[0] as DbAuthor;
    }

    console.log(`[getAuthorByName] No author found for: "${trimmedName}"`);
    return null;
  } catch (error) {
    console.error('[getAuthorByName] Error in getAuthorByName:', error);
    return null;
  }
}

// Extended Author type with URL information
export type AuthorWithUrls = Author & {
  website_url?: string | null;
  youtube_url?: string | null;
};

// Convert DbAuthor to Author format for display
export function convertDbAuthorToAuthor(dbAuthor: DbAuthor, index: number = 0): AuthorWithUrls {
  const colors = [
    "bg-blue-500/10 text-blue-400",
    "bg-purple-500/10 text-purple-400",
    "bg-green-500/10 text-green-400",
    "bg-orange-500/10 text-orange-400",
    "bg-pink-500/10 text-pink-400",
    "bg-yellow-500/10 text-yellow-400",
  ];
  
  return {
    name: dbAuthor.name,
    name_zh: dbAuthor.name_zh || undefined,
    handle: `@${dbAuthor.slug}`,
    role: "Contributor",
    bio: dbAuthor.website_url || dbAuthor.youtube_url 
      ? `Visit ${dbAuthor.website_url || dbAuthor.youtube_url}` 
      : "Active workflow contributor.",
    bio_zh: dbAuthor.bio_zh || undefined,
    count: dbAuthor.workflow_count || 0,
    joined: new Date(dbAuthor.created_at).toISOString().split('T')[0],
    color: colors[index % colors.length],
    website_url: dbAuthor.website_url,
    youtube_url: dbAuthor.youtube_url,
  };
}


