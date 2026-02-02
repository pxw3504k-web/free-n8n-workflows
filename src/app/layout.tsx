import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // 避免字体加载阻塞渲染
  preload: true, // 预加载字体
});

export const metadata: Metadata = {
  title: {
    default: "n8n Workflows - 8000+ Free Templates & Automations",
    template: "%s | N8N Workflows",
  },
  description: "Download 8000+ verified n8n workflow templates. Community-curated automations for APIs, SaaS, and business processes. Ready to copy-paste JSON.",
  keywords: ["n8n workflows", "n8n templates", "automation directory", "free n8n downloads", "self-hosted automation"],
  metadataBase: new URL("https://n8nworkflows.world"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://n8nworkflows.world",
    siteName: "N8N Workflows",
    images: [{
      url: "/api/og?title=n8n%20Workflows%20-%208000+%20Templates",
      width: 1200,
      height: 630,
      alt: "N8N Workflows Directory",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "n8n Workflows - 8000+ Free Templates",
    description: "The largest directory of verified n8n automation templates.",
    images: ["/api/og?title=n8n%20Workflows%20-%208000+%20Templates"],
  },
  manifest: "/manifest.json",
};

import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and Icons - Multiple sizes for better Google indexing */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics - 延迟加载以提升性能 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J6QZ92SKQ6" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-J6QZ92SKQ6');`}
        </Script>
      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AnimatedBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
