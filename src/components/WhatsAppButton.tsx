'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';

interface WhatsAppButtonProps {
  settings: SystemSettings;
}

export default function WhatsAppButton({ settings }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const cleanNumber = settings.whatsapp.replace(/\D/g, '');
  const url = `https://wa.me/${cleanNumber}?text=Olá,%20vi%20o%20seu%20site%20imobiliário%20e%20gostaria%20de%20conversar.`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={28} className="animate-pulse group-hover:animate-none" />
      {/* Tooltip elegante */}
      <span className="absolute right-16 bg-stone-900 text-white text-[11px] tracking-wider uppercase font-medium px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-stone-800">
        Falar no WhatsApp
      </span>
    </a>
  );
}
