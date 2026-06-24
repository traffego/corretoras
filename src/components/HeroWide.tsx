'use client';

import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';
import SearchBar from './SearchBar';
import { useEffect, useRef } from 'react';

interface HeroWideProps {
  settings: SystemSettings;
  bairros: string[];
  condominios: string[];
}

export default function HeroWide({ settings, bairros, condominios }: HeroWideProps) {
  const videoRef = useRef<HTMLDivElement>(null);

  // Parallax sutil no scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrollY = window.scrollY;
        videoRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Fundo gradiente de alto padrão com parallax */}
      <div
        ref={videoRef}
        className="absolute inset-0 -top-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950"
        style={{ willChange: 'transform' }}
      >
        {/* Textura de fundo */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5a880' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradiente de cor da marca */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-900/50" />
        {/* Acento dourado */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>

      {/* Conteúdo central */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-primary/30 px-5 py-2.5 rounded-full shadow-lg mb-8">
          <Award size={15} className="text-primary" />
          <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-200">
            Atendimento Premium • {settings.creci}
          </span>
        </div>

        {/* Título */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] max-w-5xl mb-6">
          Imóveis que contam
          <span className="block text-primary italic font-light mt-1">sua história.</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-stone-300 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
          {settings.biografia_curta}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/imoveis"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-semibold text-sm tracking-wider uppercase shadow-2xl shadow-primary/30 transition duration-300 active:scale-95"
          >
            <span>Ver Imóveis</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-10 py-4 rounded-full font-semibold text-sm tracking-wider uppercase transition duration-300 active:scale-95"
          >
            Agendar Visita
          </Link>
        </div>
      </div>

      {/* Linha divisória dourada */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8" />
        <SearchBar bairros={bairros} condominios={condominios} dark />
      </div>
    </section>
  );
}
