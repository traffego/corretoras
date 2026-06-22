import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getSettings, supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import PropertyCarousel from '@/components/PropertyCarousel';
import ContactForm from '@/components/ContactForm';

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
      <Hero settings={settings} bairros={bairros} condominios={condominios} />

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

      {/* 3. Seção Sobre Mim / Apresentação */}
      <section className="bg-stone-100 py-20 border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lado Esquerdo: Imagem da Corretora */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-white border border-stone-200">
              {settings.foto_perfil_url ? (
                <Image
                  src={settings.foto_perfil_url}
                  alt={settings.nome_corretora}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-serif">
                  Sem Foto
                </div>
              )}
            </div>
            {/* Decoração flutuante */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-stone-100 flex flex-col items-center">
              <ShieldCheck size={28} className="text-primary mb-1" />
              <span className="text-[9px] tracking-wider uppercase font-semibold text-stone-400">
                Garantia e Credibilidade
              </span>
              <span className="text-xs font-bold text-secondary mt-0.5">
                {settings.creci}
              </span>
            </div>
          </div>

          {/* Lado Direito: Texto Biográfico */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
                Sobre a Corretora
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
                {settings.nome_corretora}
              </h2>
            </div>

            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              {settings.biografia_longa}
            </p>

            {/* Diferenciais em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-secondary">
              {[
                'Atendimento exclusivo com hora marcada',
                'Curadoria rigorosa de portfólio',
                'Assessoria jurídica completa no fechamento',
                'Transparência e discrição em negociações',
              ].map((diff, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/sobre-mim"
                className="inline-flex items-center space-x-2 bg-secondary text-white hover:bg-stone-850 active:scale-95 px-8 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase shadow-md transition duration-300"
              >
                <span>Conhecer Trajetória Completa</span>
              </Link>
            </div>
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
                  <a
                    href={whatsappInfo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-secondary hover:text-primary transition"
                  >
                    {whatsappInfo.display}
                  </a>
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
