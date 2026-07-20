export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/supabase";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    try {
      const headersList = await headers();
      const host = headersList.get('host');
      if (host) {
        const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
        siteUrl = `${protocol}://${host}`;
      }
    } catch {
      // Ignorar erro se headers não estiverem disponíveis (ex: build)
    }
  }

  if (!siteUrl) {
    siteUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
  }

  // Garantir que comece com protocolo http/https
  if (siteUrl && !siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    siteUrl = `https://${siteUrl}`;
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.nome_corretora,
      template: `%s | ${settings.nome_corretora}`,
    },
    description: settings.biografia_curta,
    openGraph: {
      title: settings.nome_corretora,
      description: settings.biografia_curta,
      images: [
        {
          url: '/compartilhar.png',
          width: 1200,
          height: 630,
          alt: settings.nome_corretora,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.nome_corretora,
      description: settings.biografia_curta,
      images: ['/compartilhar.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
      style={{
        "--color-primary": settings.cor_primaria,
        "--color-secondary": settings.cor_secundaria,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-[#1c1917]">
        {children}
      </body>
    </html>
  );
}
