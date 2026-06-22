'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface PropertyGalleryProps {
  images: { url: string; ordem: number }[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ordena as fotos pela ordem configurada
  const sortedImages = [...images].sort((a, b) => a.ordem - b.ordem);

  if (sortedImages.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-stone-200 rounded-2xl flex items-center justify-center text-stone-400 font-serif">
        Nenhuma imagem cadastrada
      </div>
    );
  }

  const activeImage = sortedImages[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Imagem Principal (Grande) */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md bg-stone-150 border border-stone-200/50 group">
        <Image
          src={activeImage.url}
          alt={`Foto ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-w-1024px) 100vw, 800px"
          className="object-cover"
        />

        {/* Overlay hover para ampliar */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="bg-white/95 text-secondary hover:bg-primary hover:text-white p-3.5 rounded-full shadow-lg transition duration-300 active:scale-95 cursor-pointer"
            aria-label="Abrir galeria completa"
          >
            <Maximize size={20} />
          </button>
        </div>

        {/* Setas Rápidas no Slide principal */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-secondary p-2.5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-secondary p-2.5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Próximo"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Grid de Miniaturas */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {sortedImages.map((img, idx) => (
            <button
              key={img.url}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-stone-100 transition-all duration-300 ${
                activeIndex === idx
                  ? 'border-primary shadow-sm scale-95'
                  : 'border-transparent hover:border-stone-300'
              }`}
            >
              <Image
                src={img.url}
                alt={`Miniatura ${idx + 1}`}
                fill
                sizes="(max-w-768px) 25vw, 150px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal (Galeria Completa) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
          {/* Botão de Fechar */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition cursor-pointer"
            aria-label="Fechar"
          >
            <X size={28} />
          </button>

          {/* Seta Esquerda */}
          {sortedImages.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full transition cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Foto Principal do Lightbox */}
          <div className="relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] max-h-[85vh]">
            <Image
              src={sortedImages[activeIndex].url}
              alt={`Foto da galeria ${activeIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Seta Direita */}
          {sortedImages.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-full transition cursor-pointer"
              aria-label="Próximo"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Contador de Fotos */}
          <div className="absolute bottom-6 text-white/60 text-xs tracking-widest font-semibold uppercase">
            {activeIndex + 1} / {sortedImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
