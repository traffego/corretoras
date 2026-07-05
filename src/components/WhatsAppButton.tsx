'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';
import WhatsAppSelectModal from './WhatsAppSelectModal';

interface Corretor {
  nome: string;
  whatsapp?: string | null;
  foto_url?: string | null;
}

interface WhatsAppButtonProps {
  settings: SystemSettings;
  corretores?: Corretor[];
}

export default function WhatsAppButton({ settings, corretores = [] }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [whatsModalOpen, setWhatsModalOpen] = useState(false);

  // Monitorar scroll para mostrar/esconder o botão flutuante
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setWhatsModalOpen(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Filtrar corretores ativos que possuem WhatsApp cadastrado
  const corretoresComWhats = corretores.filter((c) => c.whatsapp && c.whatsapp.trim() !== '');

  const getWhatsLink = (num: string, nome?: string) => {
    const cleanNum = num.replace(/\D/g, '');
    const saudacao = nome ? `Olá%20${nome.split(' ')[0]}` : 'Olá';
    return `https://wa.me/${cleanNum}?text=${saudacao},%20vi%20o%20seu%20site%20imobiliário%20e%20gostaria%20de%20conversar.`;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (corretoresComWhats.length > 1) {
      e.preventDefault();
      setWhatsModalOpen(true);
    }
  };

  const cleanEscritorioNum = settings.whatsapp.replace(/\D/g, '');
  const urlEscritorio = `https://wa.me/${cleanEscritorioNum}?text=Olá,%20vi%20o%20seu%20site%20imobiliário%20e%20gostaria%20de%20conversar.`;

  // Mapear link de disparo caso só exista 1 ou nenhum corretor
  const getSingleOrEscritorioLink = () => {
    if (corretoresComWhats.length === 1) {
      return getWhatsLink(corretoresComWhats[0].whatsapp!, corretoresComWhats[0].nome);
    }
    return urlEscritorio;
  };

  return (
    <>
      <a
        href={corretoresComWhats.length > 1 ? '#' : getSingleOrEscritorioLink()}
        onClick={handleButtonClick}
        target={corretoresComWhats.length > 1 ? undefined : '_blank'}
        rel={corretoresComWhats.length > 1 ? undefined : 'noopener noreferrer'}
        className={`fixed bottom-6 right-6 z-[9999] flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group ${
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

      {/* Modal de Seleção (aberto no centro da tela com backdrop) */}
      <WhatsAppSelectModal
        open={whatsModalOpen}
        onClose={() => setWhatsModalOpen(false)}
        corretores={corretores}
        settings={settings}
      />
    </>
  );
}
