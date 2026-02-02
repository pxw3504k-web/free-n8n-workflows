import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'N8N Workflows - Free Templates & Automations',
    short_name: 'N8N Workflows',
    description: 'Download ready-to-use n8n workflows instantly. 1000+ free templates for automation, APIs, integrations & business processes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030315',
    theme_color: '#6366f1',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
