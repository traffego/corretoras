export const dynamic = 'force-dynamic';

import { getSettings, supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  // Buscar corretores ativos para exibição no WhatsApp e CRECI
  const { data: corretoresData } = await supabase
    .from('corretores')
    .select('nome, whatsapp, foto_url, creci')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  const corretores = corretoresData || [];

  return (
    <>
      <Header settings={settings} corretores={corretores} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} corretores={corretores} />
    </>
  );
}
