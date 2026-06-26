export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getSettings, supabase } from '@/lib/supabase';
import HeroSelector from '@/components/HeroSelector';
import PropertyCarousel from '@/components/PropertyCarousel';
import ContactForm from '@/components/ContactForm';
import CorretoresCarousel, { type Corretor } from '@/components/CorretoresCarousel';
import WhatsAppLeadButton from '@/components/WhatsAppLeadButton';

export default async function Home() {
  const settings = await getSettings();

  // Buscar todos os imóveis ativos
  const { data: allProperties } = await supabase
    .from('properties')
    .select('*, property_images(url, ordem)')
    .eq('ativo', true);

  const properties = allProperties || [];

  // Filtrar os destaques
  const highlightedProperties = properties.filter((p) => p.destaque === true);

  // Buscar corretores ativos para a seção "Sobre"
  const { data: corretoresData } = await supabase
    .from('corretores')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  const corretores: Corretor[] =
    corretoresData && corretoresData.length > 0
      ? corretoresData
      : [
          {
            id: 'fallback',
            nome: settings.nome_corretora,
            creci: settings.creci,
            biografia_curta: settings.biografia_curta,
            biografia_longa: settings.biografia_longa,
            foto_url: settings.foto_perfil_url,
            especialidade: null,
            diferenciais: [
              'Atendimento exclusivo com hora marcada',
              'Curadoria rigorosa de portfólio',
              'Assessoria jurídica completa no fechamento',
              'Transparência e discrição em negociações',
            ],
          },
        ];

  // Diferenciais do primeiro corretor (para fallback)
  const diferenciais: string[] =
    corretores[0]?.diferenciais && corretores[0].diferenciais.length > 0
      ? corretores[0].diferenciais
      : [
          'Atendimento exclusivo com hora marcada',
          'Curadoria rigorosa de portfólio',
          'Assessoria jurídica completa no fechamento',
          'Transparência e discrição em negociações',
        ];

  // Extrair bairros e condomínios únicos para o SearchBar
  const bairros = Array.from(
    new Set(properties.map((p) => p.bairro).filter(Boolean))
  ) as string[];

  const condominios = Array.from(
    new Set(properties.map((p) => p.condominio).filter(Boolean))
  ) as string[];

  const formatWhatsAppNumber = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return {
      link: `https://wa.me/${cleanNum}`,
      display: num,
    };
  };

  const whatsappInfo = formatWhatsAppNumber(settings.whatsapp);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Seção Hero + Busca */}
      <HeroSelector
        settings={settings}
        bairros={bairros}
        condominios={condominios}
        highlightedProperties={highlightedProperties}
        corretores={corretores}
      />

      {/* 2. Seção de Destaques */}
      {highlightedProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left space-y-3 mb-10">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">
              Curadoria Exclusiva
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
              Imóveis em Destaque
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto md:mx-0 rounded-full" />
          </div>
          <PropertyCarousel properties={highlightedProperties} />
        </section>
      )}

      {/* 3. Seção Sobre / Corretoras */}
      <section className="bg-stone-100 py-20 border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
              {corretores.length === 1 ? 'Sobre a Corretora' : 'Nossa Equipe'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
              {corretores.length === 1 ? corretores[0].nome : 'Conheça Nossas Corretoras'}
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <CorretoresCarousel corretores={corretores} />

          <div className="text-center pt-2">
            <Link
              href="/sobre-mim"
              className="inline-flex items-center space-x-2 bg-secondary text-white hover:opacity-90 active:scale-95 px-8 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase shadow-md transition duration-300"
            >
              <span>Conhecer Trajetória Completa</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Seção de Contato e Localização */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Lado Esquerdo: Info de Contato */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
                Atendimento Personalizado
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
                Pronto para dar o próximo passo?
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
                Seja para comprar, vender ou tirar dúvidas, estou disponível para prestar uma consultoria de excelência.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Phone size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
                    Fale no WhatsApp
                  </span>
                  <WhatsAppLeadButton
                    whatsLink={whatsappInfo.link}
                    label={whatsappInfo.display}
                    context={{ tipo: 'geral' }}
                    className="!py-1.5 !px-0 !bg-transparent !shadow-none !text-secondary hover:!text-primary !text-base !font-bold !tracking-normal !uppercase-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
                    Envie um E-mail
                  </span>
                  <a
                    href={`mailto:${settings.email_destino}`}
                    className="text-base font-bold text-secondary hover:text-primary transition break-all"
                  >
                    {settings.email_destino}
                  </a>
                </div>
              </div>

              {/* CRECI */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Award size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
                    Registro de Classe
                  </span>
                  <span className="text-base font-bold text-secondary">
                    {settings.creci}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Formulário */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
