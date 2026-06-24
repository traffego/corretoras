export const dynamic = 'force-dynamic';

import { getSettings } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </>
  );
}
