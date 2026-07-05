'use client';

import Link from 'next/link';
import { ArrowRight, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';
import SearchBar from './SearchBar';
import { useState, useEffect, useCallback } from 'react';
import { Corretor } from './CorretoresCarousel';

interface PropertyImage {
  url: string;
  ordem: number;
}

interface Property {
  id: string;
  titulo: string;
  bairro: string;
  preco: number;
  property_images?: PropertyImage[];
}

interface HeroGalleryProps {
  settings: SystemSettings;
  bairros: string[];
  condominios: string[];
  highlightedProperties: Property[];
  corretores?: Corretor[];
}

export default function HeroGallery({ settings, bairros, condominios, highlightedProperties, corretores = [] }: HeroGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getCreciString = () => {
    if (corretores && corretores.length > 0) {
      const activeCrecis = corretores.map(c => c.creci).filter(Boolean);
      if (activeCrecis.length > 0) {
        return activeCrecis.join(' / ');
      }
    }
    return settings.creci;
  };

  // Montar lista de imagens a partir dos imóveis em destaque
  const slides = highlightedProperties
    .map((p) => {
      const sorted = (p.property_images || []).sort((a, b) => a.ordem - b.ordem);
      return sorted.length > 0
        ? { url: sorted[0].url, titulo: p.titulo, bairro: p.bairro, preco: p.preco, id: p.id }
        : null;
    })
    .filter(Boolean) as { url: string; titulo: string; bairro: string; preco: number; id: string }[];

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || slides.length === 0) return;
      setIsAnimating(true);
      setCurrentIndex((index + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating, slides.length]
  );

  // Auto-avanço a cada 5s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(currentIndex + 1), 5000);
    return () => clearInterval(timer);
  }, [currentIndex, goTo, slides.length]);

  const formatPrice = (price: number) =>
    price > 0
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)
      : 'Consulte';

  const current = slides[currentIndex];

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Slides de fundo */}
      {slides.length > 0 ? (
        slides.map((slide, i) => (
          <div
            key={slide.url + i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.url}
              alt={slide.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-stone-900/30" />
          </div>
        ))
      ) : (
        // Fallback sem imagens
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
        </div>
      )}

      {/* Controles de navegação */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full transition duration-300 active:scale-95"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full transition duration-300 active:scale-95"
            aria-label="Próximo"
          >
            <ChevronRight size={22} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-[420px] md:bottom-64 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-primary/40 px-5 py-2.5 rounded-full shadow-lg mb-8">
          <Award size={15} className="text-primary" />
          <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-200">
            Atendimento Premium • {getCreciString()}
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mb-4">
          {current ? (
            <>
              <span className="block text-primary italic font-light text-2xl sm:text-3xl mb-3 tracking-wide">
                Em Destaque
              </span>
              {current.titulo}
            </>
          ) : (
            <>
              Imóveis de{' '}
              <span className="text-primary italic font-light">alto padrão</span>
            </>
          )}
        </h1>

        {current && (
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-stone-300 text-sm tracking-wider uppercase">{current.bairro}</span>
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            <span className="text-primary font-bold text-lg">{formatPrice(current.preco)}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/imoveis"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-semibold text-sm tracking-wider uppercase shadow-2xl shadow-primary/30 transition duration-300 active:scale-95"
          >
            <span>Ver Todos os Imóveis</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-10 py-4 rounded-full font-semibold text-sm tracking-wider uppercase transition duration-300 active:scale-95"
          >
            Agendar Visita
          </Link>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8" />
        <SearchBar bairros={bairros} condominios={condominios} dark />
      </div>
    </section>
  );
}
