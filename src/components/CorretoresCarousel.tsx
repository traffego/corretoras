'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Award, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export interface Corretor {
  id: string;
  nome: string;
  creci?: string | null;
  biografia_curta?: string | null;
  biografia_longa?: string | null;
  foto_url?: string | null;
  especialidade?: string | null;
  diferenciais?: string[] | null;
}

interface CorretoresCarouselProps {
  corretores: Corretor[];
}

export default function CorretoresCarousel({ corretores }: CorretoresCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = corretores.length;

  if (total === 0) return null;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [total, paused, next]);

  const corretor = corretores[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Foto */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 sm:w-80 h-96 sm:h-[420px]">
            {/* Borda decorativa */}
            <div className="absolute inset-0 border border-primary rounded-t-[10rem] rounded-b-2xl translate-x-4 translate-y-4 -z-10" />
            <div className="absolute inset-0 rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl bg-white border-4 border-white">
              {corretor.foto_url ? (
                <Image
                  src={corretor.foto_url}
                  alt={corretor.nome}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 font-serif text-lg">
                  Sem Foto
                </div>
              )}
            </div>

            {/* Badge de especialidade */}
            {corretor.especialidade && (
              <div className="absolute bottom-6 -left-6 bg-secondary text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-stone-800 max-w-[180px]">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-300 leading-tight">
                  {corretor.especialidade}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Texto */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
              Apresentação Profissional
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-secondary">
              {corretor.nome}
            </h2>
            {corretor.creci && (
              <div className="inline-flex items-center space-x-1.5 text-xs text-stone-500 bg-stone-200/50 px-3 py-1 rounded-md">
                <Award size={14} className="text-primary" />
                <span>{corretor.creci}</span>
              </div>
            )}
          </div>

          {corretor.biografia_curta && (
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-medium italic">
              &ldquo;{corretor.biografia_curta}&rdquo;
            </p>
          )}

          {corretor.biografia_longa && (
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {corretor.biografia_longa}
            </p>
          )}

          {/* Diferenciais */}
          {corretor.diferenciais && corretor.diferenciais.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {corretor.diferenciais.map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm font-semibold text-secondary">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navegação — só aparece se tiver mais de 1 */}
      {total > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-6">
          <button
            onClick={prev}
            className="p-3 bg-white border border-stone-200 hover:border-primary hover:text-primary text-secondary rounded-full shadow-sm transition duration-300 active:scale-95"
            aria-label="Corretor anterior"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Indicadores */}
          <div className="flex space-x-2">
            {corretores.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Ver corretor ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 bg-white border border-stone-200 hover:border-primary hover:text-primary text-secondary rounded-full shadow-sm transition duration-300 active:scale-95"
            aria-label="Próximo corretor"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
