export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.nome_corretora,
      template: `%s | ${settings.nome_corretora}`,
    },
    description: settings.biografia_curta,
    openGraph: {
      title: settings.nome_corretora,
      description: settings.biografia_curta,
      images: settings.foto_perfil_url ? [settings.foto_perfil_url] : [],
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
