'use client';

import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';
import { Corretor } from './CorretoresCarousel';
import SearchBar from './SearchBar';

interface HeroCorretoresProps {
  settings: SystemSettings;
  bairros: string[];
  condominios: string[];
  corretores: Corretor[];
}

/**
 * Calcula o clip-path diagonal para cada painel.
 * A linha divisória vai de cima-direita para baixo-esquerda, criando
 * a separação diagonal premium entre as seções.
 */
function getCustomClipPath(idx: number, total: number, start: number, end: number): string {
  if (total <= 1) return '';
  const D = 6; // deslocamento diagonal em %

  const tl = idx === 0 ? 0 : start;
  const tr = idx === total - 1 ? 100 : end;
  const bl = idx === 0 ? 0 : start - D;
  const br = idx === total - 1 ? 100 : end - D;

  return `polygon(${tl}% 0%, ${tr}% 0%, ${br}% 100%, ${bl}% 100%)`;
}

export default function HeroCorretores({
  settings,
  bairros,
  condominios,
  corretores,
}: HeroCorretoresProps) {
  const getCreciString = () => {
    if (corretores && corretores.length > 0) {
      const activeCrecis = corretores.map(c => c.creci).filter(Boolean);
      if (activeCrecis.length > 0) {
        return activeCrecis.join(' / ');
      }
    }
    return settings.creci;
  };

  const N = corretores.length;
  if (N === 0) return null;

  // Montar os painéis: esquerdo (borrado), corretores normais, direito (borrado)
  const panels = [];
  
  // Painel esquerdo (borrado, reflete primeiro corretor)
  panels.push({
    isBlurred: true,
    corretor: corretores[0],
    weight: 1,
  });

  // Painéis centrais (normais)
  corretores.forEach((c) => {
    panels.push({
      isBlurred: false,
      corretor: c,
      weight: 4,
    });
  });

  // Painel direito (borrado, reflete último corretor)
  panels.push({
    isBlurred: true,
    corretor: corretores[N - 1],
    weight: 1,
  });

  const total = N + 2;
  const totalWeight = panels.reduce((sum, p) => sum + p.weight, 0);
  
  let currentStart = 0;
  const panelsWithCoords = panels.map((p, idx) => {
    const start = currentStart;
    const end = start + (p.weight / totalWeight) * 100;
    currentStart = end;
    return {
      ...p,
      start,
      end,
    };
  });

  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex flex-col justify-end overflow-hidden bg-stone-950">
      {/* ── Painéis diagonais com clip-path ── */}
      <div className="absolute inset-0 flex">
        {panelsWithCoords.map((p, i) => {
          const clipPath = getCustomClipPath(i, total, p.start, p.end);
          return (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-500"
              style={{
                clipPath,
                zIndex: p.isBlurred ? 1 : 10,
                // Sombra projetada nas laterais dos painéis normais
                filter: p.isBlurred
                  ? 'none'
                  : 'drop-shadow(-8px 0 10px rgba(0,0,0,0.6)) drop-shadow(8px 0 10px rgba(0,0,0,0.6))',
              }}
            >
              {p.corretor.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.corretor.foto_url}
                  alt={p.corretor.nome}
                  className={`absolute h-full object-cover transition-all duration-500 ${
                    p.isBlurred ? 'w-full left-0 blur-lg scale-110' : ''
                  }`}
                  style={{
                    objectPosition: 'center top',
                    ...(!p.isBlurred && {
                      left: `${p.start - 6}%`,
                      width: `${(p.end - p.start) + 6}%`,
                    }),
                  }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: p.isBlurred
                      ? 'linear-gradient(180deg, #1c1917, #0c0a09)'
                      : `linear-gradient(160deg, hsl(${20 + i * 35}, 12%, ${28 - i * 4}%), hsl(${20 + i * 35}, 12%, 10%))`,
                  }}
                />
              )}

              {/* Overlays de escurecimento e gradiente */}
              {p.isBlurred ? (
                <div className="absolute inset-0 bg-stone-950/65" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/92 via-stone-900/40 to-stone-900/5" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Caso N === 1: Textos centralizados e CTAs ── */}
      {N === 1 && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-end text-center px-6 pt-32 pb-8">
          {/* Badge CRECI */}
          <div className="hidden md:inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-primary/40 px-5 py-2.5 rounded-full shadow-lg mb-6">
            <Award size={15} className="text-primary" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-200">
              {corretores[0].creci || settings.creci}
            </span>
          </div>

          {/* Nome da corretora */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mb-4 drop-shadow-lg">
            {corretores[0].nome}
          </h1>

          {/* Frase curta */}
          {corretores[0].biografia_curta && (
            <p className="text-stone-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-10 drop-shadow-md">
              &ldquo;{corretores[0].biografia_curta}&rdquo;
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Link
              href="/imoveis"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-semibold text-sm tracking-wider uppercase shadow-2xl shadow-primary/30 transition duration-300 active:scale-95"
            >
              <span>Ver Imóveis</span>
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
      )}

      {/* ── Caso N > 1: Textos sobrepostos em cada coluna correspondente ── */}
      {N > 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {corretores.map((c, i) => {
            const panel = panelsWithCoords[i + 1];
            const leftPct = panel.start + 1.0;
            const widthPct = (panel.end - panel.start) - 2.0;
            return (
              <div
                key={c.id}
                className="absolute bottom-32 md:bottom-44 space-y-1 md:space-y-2 px-2 md:px-5 text-center"
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              >
                {c.creci && (
                  <span className="text-[7px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] uppercase font-semibold text-primary block drop-shadow-md">
                    {c.creci}
                  </span>
                )}
                <h2 className="font-serif text-xs sm:text-sm md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight drop-shadow-lg break-words">
                  {c.nome}
                </h2>
                {c.biografia_curta && (
                  <p className="text-stone-300 text-[8px] sm:text-[10px] md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 drop-shadow-md">
                    {c.biografia_curta}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Badge centralizado no topo (se N > 1) */}
      {N > 1 && (
        <div className="absolute top-28 left-0 right-0 z-30 hidden md:flex justify-center pointer-events-none">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-primary/40 px-5 py-2.5 rounded-full shadow-lg">
            <Award size={15} className="text-primary" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-200">
              Atendimento Premium • {getCreciString()}
            </span>
          </div>
        </div>
      )}

      {/* Barra de Busca */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-6 pb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8" />
        <SearchBar bairros={bairros} condominios={condominios} dark />
      </div>
    </section>
  );
}
