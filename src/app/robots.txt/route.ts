import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n8nworkflows.world').replace(/\/$/, '');
    const content = `User-agent: *
Disallow:

Sitemap: ${siteUrl}/sitemap.xml
`;
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('robots.txt error', err);
    return new NextResponse('User-agent: *\nDisallow:', { status: 500 });
  }
}


