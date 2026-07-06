export const dynamic = 'force-dynamic';

import { Phone, Mail, Award, Clock, MapPin } from 'lucide-react';
import { getSettings, supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Contato',
  description: 'Fale conosco e agende seu atendimento personalizado.',
};

export default async function ContatoPage() {
  const settings = await getSettings();

  const { data: corretoresData } = await supabase
    .from('corretores')
    .select('nome, whatsapp, foto_url, creci')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  const corretores = corretoresData || [];

  const formatWhatsAppNumber = (num: string, nome?: string) => {
    const cleanNum = num.replace(/\D/g, '');
    let display = num;
    if (cleanNum.length === 13 && cleanNum.startsWith('55')) {
      const parts = cleanNum.slice(2);
      display = `(${parts.slice(0, 2)}) ${parts.slice(2, 7)}-${parts.slice(7)}`;
    }
    const saudacao = nome ? `Olá%20${nome.split(' ')[0]}` : 'Olá';
    return {
      link: `https://wa.me/${cleanNum}?text=${saudacao},%20vi%20o%20seu%20site%20imobiliário%20e%20gostaria%20de%20conversar.`,
      display,
    };
  };

  const getCreciString = () => {
    if (corretores && corretores.length > 0) {
      const activeCrecis = corretores.map(c => c.creci).filter(Boolean);
      if (activeCrecis.length > 0) {
        return activeCrecis.join(' / ');
      }
    }
    return settings.creci;
  };

  const whatsappInfo = formatWhatsAppNumber(settings.whatsapp);
  const corretoresComWhats = corretores.filter((c) => c.whatsapp && c.whatsapp.trim() !== '');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Cabeçalho da Página */}
      <div className="border-b border-stone-200/60 pb-8 mb-12 space-y-2 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
          Fale Conosco
        </h1>
        <p className="text-sm text-stone-500">
          Entre em contato pelos canais de atendimento ou nos envie uma mensagem diretamente pelo formulário.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Info de Contato */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-secondary">
              Canais de Atendimento
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Escolha a forma que preferir. Estamos prontos para responder de forma rápida e qualificada.
            </p>
          </div>

          {/* Cards de Contato */}
          <div className="grid grid-cols-1 gap-4">
            {/* WhatsApp */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-1 w-full">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  WhatsApp
                </span>
                {corretoresComWhats.length > 0 ? (
                  <div className="flex flex-col space-y-2">
                    {corretoresComWhats.map((c, idx) => {
                      const info = formatWhatsAppNumber(c.whatsapp!, c.nome);
                      return (
                        <a
                          key={idx}
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-bold text-secondary hover:text-primary transition block"
                        >
                          {info.display} - {c.nome.split(' ')[0]}
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <a
                    href={whatsappInfo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-secondary hover:text-primary transition"
                  >
                    {whatsappInfo.display}
                  </a>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  E-mail
                </span>
                <a
                  href={`mailto:${settings.email_destino}`}
                  className="text-base font-bold text-secondary hover:text-primary transition break-all"
                >
                  {settings.email_destino}
                </a>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  Endereço do Escritório
                </span>
                <span className="text-sm font-semibold text-secondary">
                  Rua Gurmecindo Antonietti Marques (4A), 430W ao lado do Que de minas - Jardim Acácia - CEP: 78.300-053
                </span>
              </div>
            </div>

            {/* Horário */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  Horário de Atendimento
                </span>
                <span className="text-sm font-semibold text-secondary">
                  Segunda a Sexta: 08h às 18h<br />Sábados: 08h às 12h (Plantão)
                </span>
              </div>
            </div>

            {/* CRECI */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Award size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  Registro Profissional
                </span>
                <span className="text-sm font-bold text-secondary">
                  {getCreciString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa no lugar do Formulário */}
        <div className="lg:col-span-7 w-full h-full flex flex-col space-y-4">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-secondary">
              Nossa Localização
            </h2>
            <p className="text-sm text-stone-500">
              Venha nos visitar no nosso escritório central.
            </p>
          </div>
          <div className="w-full overflow-hidden rounded-3xl border border-stone-200/50 shadow-sm flex-grow">
            <iframe
              src={`https://maps.google.com/maps?q=Rua%20Gumercindo%20Antonietti%20Marques%2C%20430W%2C%20Jardim%20Ac%C3%A1cia%2C%20Tangar%C3%A1%20da%20Serra%20-%20MT%20(${encodeURIComponent(settings.nome_corretora)})&t=&z=17&ie=UTF8&iwloc=A&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
