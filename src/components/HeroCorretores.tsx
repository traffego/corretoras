'use client';

import Image from 'next/image';
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
 * a separação diagonal premium entre as seções de cada corretor.
 */
function getPanelClipPath(index: number, total: number): string {
  if (total <= 1) return '';
  const D = 9; // deslocamento diagonal em %
  const W = 100 / total;

  const tl = index === 0 ? 0 : index * W;
  const tr = index === total - 1 ? 100 : (index + 1) * W;
  const bl = index === 0 ? 0 : index * W - D;
  const br = index === total - 1 ? 100 : (index + 1) * W - D;

  return `polygon(${tl}% 0%, ${tr}% 0%, ${br}% 100%, ${bl}% 100%)`;
}

export default function HeroCorretores({
  settings,
  bairros,
  condominios,
  corretores,
}: HeroCorretoresProps) {
  const total = corretores.length;

  if (total === 0) return null;

  // ─── LAYOUT UMA SÓ CORRETORA ────────────────────────────────────────────────
  if (total === 1) {
    const c = corretores[0];
    return (
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Foto como fundo full-screen */}
        <div className="absolute inset-0">
          {c.foto_url ? (
            <Image
              src={c.foto_url}
              alt={c.nome}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950" />
          )}
          {/* Gradiente para legibilidade do texto abaixo */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/10" />
          {/* Vinheta lateral sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/30 via-transparent to-stone-950/30" />
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-end text-center px-6 pt-32 pb-8">
          {/* Badge CRECI */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-primary/40 px-5 py-2.5 rounded-full shadow-lg mb-6">
            <Award size={15} className="text-primary" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-200">
              {c.creci || settings.creci}
            </span>
          </div>

          {/* Nome da corretora */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mb-4 drop-shadow-lg">
            {c.nome}
          </h1>

          {/* Frase curta */}
          {c.biografia_curta && (
            <p className="text-stone-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-10 drop-shadow-md">
              &ldquo;{c.biografia_curta}&rdquo;
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

        {/* Barra de Busca */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-10">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8" />
          <SearchBar bairros={bairros} condominios={condominios} dark />
        </div>
      </section>
    );
  }

  // ─── LAYOUT MÚLTIPLAS CORRETORAS (painéis diagonais) ───────────────────────
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

      {/* ── Desktop: painéis diagonais com clip-path ── */}
      <div className="absolute inset-0 hidden md:block">
        {corretores.map((c, i) => {
          const clipPath = getPanelClipPath(i, total);
          return (
            <div
              key={c.id}
              className="absolute inset-0"
              style={{ clipPath, zIndex: i }}
            >
              {c.foto_url ? (
                <Image
                  src={c.foto_url}
                  alt={c.nome}
                  fill
                  priority={i === 0}
                  sizes="50vw"
                  className="object-cover object-top"
                  style={{ objectPosition: `${((i + 0.5) / total) * 100}% top` }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(160deg, hsl(${20 + i * 35}, 12%, ${28 - i * 4}%), hsl(${20 + i * 35}, 12%, 10%))`,
                  }}
                />
              )}
              {/* Overlay gradiente por painel */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/92 via-stone-900/40 to-stone-900/5" />
            </div>
          );
        })}
      </div>

      {/* ── Desktop: textos sobrepostos a cada painel ── */}
      <div className="absolute inset-0 z-20 hidden md:block pointer-events-none">
        {corretores.map((c, i) => {
          const W = 100 / total;
          // Centraliza o texto visualmente dentro do painel, com leve offset para a esquerda
          // (a diagonal puxa a área visível um pouco para a esquerda)
          const leftPct = i * W + 1.5;
          const widthPct = W - 3;
          return (
            <div
              key={c.id}
              className="absolute bottom-36 space-y-2 px-5"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            >
              {c.creci && (
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-primary block drop-shadow-md">
                  {c.creci}
                </span>
              )}
              <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {c.nome}
              </h2>
              {c.biografia_curta && (
                <p className="text-stone-300 text-xs lg:text-sm leading-relaxed line-clamp-3 drop-shadow-md">
                  {c.biografia_curta}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Mobile: painéis empilhados verticalmente ── */}
      <div className="absolute inset-0 flex flex-col md:hidden">
        {corretores.map((c, i) => (
          <div key={c.id} className="relative overflow-hidden" style={{ flex: 1 }}>
            {c.foto_url ? (
              <Image
                src={c.foto_url}
                alt={c.nome}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-top"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(160deg, hsl(${20 + i * 35}, 12%, ${28 - i * 4}%), hsl(${20 + i * 35}, 12%, 10%))`,
                }}
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/50 to-transparent" />
            {/* Info da corretora */}
            <div className="absolute bottom-4 left-5 right-5 space-y-1">
              {c.creci && (
                <span className="text-[9px] tracking-widest uppercase font-semibold text-primary block">
                  {c.creci}
                </span>
              )}
              <h2 className="font-serif text-xl font-bold text-white leading-tight drop-shadow-md">
                {c.nome}
              </h2>
              {c.biografia_curta && (
                <p className="text-stone-300 text-xs leading-relaxed line-clamp-2">
                  {c.biografia_curta}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Badge centralizado no topo (ambos layouts) */}
      <div className="absolute top-28 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-primary/40 px-5 py-2.5 rounded-full shadow-lg">
          <Award size={15} className="text-primary" />
          <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-200">
            Atendimento Premium • {settings.creci}
          </span>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-6 pb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8" />
        <SearchBar bairros={bairros} condominios={condominios} dark />
      </div>
    </section>
  );
}
