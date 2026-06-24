export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Tag, Award, Phone } from 'lucide-react';
import { getSettings, supabase } from '@/lib/supabase';
import PropertyGallery from '@/components/PropertyGallery';
import FeatureIcons from '@/components/FeatureIcons';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

interface ImovelDetailPageProps {
  params: Promise<{ slug: string }>;
}

// 1. Geração de Metadados Dinâmicos (SEO) por Imóvel
export async function generateMetadata({ params }: ImovelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: property } = await supabase
    .from('properties')
    .select('*, property_images(url, ordem)')
    .eq('slug', slug)
    .single();

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
    };
  }

  const mainImage = property.property_images?.[0]?.url || '';

  return {
    title: `${property.titulo} - ${property.bairro}`,
    description: property.descricao ? property.descricao.slice(0, 160) : '',
    openGraph: {
      title: `${property.titulo} - ${property.bairro}`,
      description: property.descricao ? property.descricao.slice(0, 160) : '',
      images: mainImage ? [{ url: mainImage }] : [],
    },
  };
}

export default async function ImovelDetailPage({ params }: ImovelDetailPageProps) {
  const { slug } = await params;
  const settings = await getSettings();

  // Buscar dados do imóvel no Supabase
  const { data: property } = await supabase
    .from('properties')
    .select('*, property_images(url, ordem)')
    .eq('slug', slug)
    .single();

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      casa: 'Casa',
      sobrado: 'Sobrado',
      apartamento: 'Apartamento',
      terreno: 'Terreno',
    };
    return labels[tipo] || tipo;
  };

  // Montar link direto de WhatsApp com mensagem personalizada para este imóvel
  const cleanPhone = settings.whatsapp.replace(/\D/g, '');
  const priceFormatted = formatPrice(property.preco);
  const whatsMsg = `Olá%20${settings.nome_corretora.split(' ')[0]},%20gostaria%20de%20saber%20mais%20informações%20sobre%20o%20imóvel%20código%20${property.codigo}%20(${property.titulo})%20no%2520valor%2520de%2520${priceFormatted}.`;
  const whatsLink = `https://wa.me/${cleanPhone}?text=${whatsMsg}`;

  // Mensagem padrão para o formulário de contato
  const formDefaultMsg = `Olá ${settings.nome_corretora.split(' ')[0]}, estou interessado no imóvel de código ${property.codigo} (${property.titulo}) e gostaria de receber mais informações.`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Botão de Voltar */}
      <Link
        href="/imoveis"
        className="inline-flex items-center space-x-2 text-stone-500 hover:text-primary transition duration-300 text-xs font-semibold uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        <span>Voltar para o catálogo</span>
      </Link>

      {/* Título e Cabeçalho do Imóvel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-stone-200/50 pb-8">
        <div className="md:col-span-8 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-primary text-white text-[10px] tracking-widest uppercase font-semibold px-3 py-1 rounded-full">
              {getTipoLabel(property.tipo)}
            </span>
            <span className="bg-secondary text-white text-[10px] tracking-widest uppercase font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
              <Tag size={10} className="text-primary" />
              <span>{property.finalidade === 'venda' ? 'Venda' : 'Aluguel'}</span>
            </span>
            <span className="text-[10px] text-stone-500 font-mono tracking-widest ml-2">
              CÓDIGO: {property.codigo}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
            {property.titulo}
          </h1>

          <div className="flex items-center space-x-2 text-sm text-stone-500">
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <span>
              {property.condominio
                ? `${property.condominio}, ${property.bairro}`
                : property.bairro}
              {` - ${property.cidade}`}
            </span>
          </div>
        </div>

        {/* Preço de Destaque */}
        <div className="md:col-span-4 text-left md:text-right space-y-1">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
            Valor do Imóvel
          </span>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-primary">
            {priceFormatted}
          </div>
        </div>
      </div>

      {/* Grid de Galeria + Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Lado Esquerdo: Galeria, Descrição e Ficha Técnica */}
        <div className="lg:col-span-8 space-y-8">
          {/* Galeria de Fotos */}
          <PropertyGallery images={property.property_images || []} />

          {/* Ficha Técnica */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-secondary">
              Ficha Técnica
            </h2>
            <FeatureIcons
              quartos={property.quartos ?? 0}
              suites={property.suites ?? 0}
              banheiros={property.banheiros ?? 0}
              vagas={property.vagas ?? 0}
              area_total={property.area_total}
              area_construida={property.area_construida}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-secondary">
              Descrição
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-stone-50 border border-stone-200/40 p-6 sm:p-8 rounded-2xl">
              {property.descricao || 'Nenhuma descrição fornecida.'}
            </p>
          </div>
        </div>

        {/* Lado Direito: Formulário e CTAs de Contato */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Caixa de Ação WhatsApp Direto */}
          <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 text-white p-2.5 rounded-xl">
                <Phone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
                  Resposta Imediata
                </span>
                <span className="text-sm font-bold text-emerald-950">
                  Agende sua visita via WhatsApp
                </span>
              </div>
            </div>
            <a
              href={whatsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs tracking-wider uppercase py-4 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>Falar pelo WhatsApp</span>
            </a>
          </div>

          {/* Formulário de Lead */}
          <ContactForm propertyId={property.id} defaultMessage={formDefaultMsg} />
        </div>
      </div>
    </div>
  );
}
