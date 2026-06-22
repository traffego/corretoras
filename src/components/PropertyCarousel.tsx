'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard, { Property } from './PropertyCard';

interface PropertyCarouselProps {
  properties: Property[];
}

export default function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const current = carouselRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      // Rodar um check inicial caso o container seja pequeno
      checkScroll();
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', checkScroll);
      }
    };
  }, [properties]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = 350; // Largura média estimada do card + gap
      const offset = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!properties || properties.length === 0) return null;

  return (
    <div className="relative w-full group">
      {/* Botão Esquerdo */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-25 bg-white hover:bg-primary hover:text-white text-secondary p-3 rounded-full shadow-xl border border-stone-200/50 hover:scale-105 active:scale-95 transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Container Carrossel */}
      <div
        ref={carouselRef}
        className="w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-4 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="snap-start snap-always shrink-0 w-[290px] xs:w-[320px] md:w-[360px] max-w-full"
          >
            <PropertyCard property={prop} />
          </div>
        ))}
      </div>

      {/* Botão Direito */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-25 bg-white hover:bg-primary hover:text-white text-secondary p-3 rounded-full shadow-xl border border-stone-200/50 hover:scale-105 active:scale-95 transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer"
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Indicador de Swipe para Mobile */}
      <div className="flex md:hidden justify-center space-x-1.5 mt-4 text-[10px] tracking-widest uppercase font-semibold text-stone-400">
        <span>Arraste para ver mais</span>
      </div>
    </div>
  );
}
