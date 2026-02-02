import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * API route to manually revalidate Opal apps cache
 * Usage: POST /api/admin/revalidate-opal
 * Optional query params:
 *   - path: specific path to revalidate (e.g., /googleopal or /googleopal/some-slug)
 *   - tag: specific tag to revalidate (default: 'opal_apps')
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const tag = searchParams.get('tag') || 'opal_apps';

    // Revalidate by tag (clears all cached data with this tag)
    revalidateTag(tag, 'max');

    const results: string[] = [`Revalidated tag: ${tag}`];

    // If specific path provided, also revalidate that path
    if (path) {
      revalidatePath(path);
      results.push(`Revalidated path: ${path}`);
    } else {
      // Revalidate common opal paths
      revalidatePath('/googleopal');
      revalidatePath('/googleopal/[slug]', 'page');
      results.push('Revalidated paths: /googleopal and /googleopal/[slug]');
    }

    return NextResponse.json({
      success: true,
      message: 'Cache revalidated successfully',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

