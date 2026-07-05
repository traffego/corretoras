'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, User } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Monitorar scroll para mostrar/esconder o botão flutuante
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setMenuOpen(false); // Fecha o menu se sumir
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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
      setMenuOpen(!menuOpen);
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
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Menu Popover das Corretoras */}
      {menuOpen && corretoresComWhats.length > 1 && (
        <div className="mb-4 w-72 bg-white rounded-2xl border border-stone-200/70 shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 border-b border-stone-800">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-primary block">
              Atendimento Exclusivo
            </span>
            <h4 className="font-serif text-sm font-bold mt-0.5">Falar pelo WhatsApp</h4>
          </div>

          {/* Lista de Contatos */}
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto bg-stone-50/50">
            {corretoresComWhats.map((c, idx) => (
              <a
                key={idx}
                href={getWhatsLink(c.whatsapp!, c.nome)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-100 transition duration-300 group"
              >
                {/* Foto / Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200 border border-stone-100 flex-shrink-0 flex items-center justify-center text-stone-500">
                  {c.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.foto_url} alt={c.nome} className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                {/* Nome */}
                <div className="flex-grow">
                  <span className="block text-xs font-semibold text-secondary group-hover:text-primary transition">
                    {c.nome}
                  </span>
                  <span className="block text-[9px] text-stone-400 uppercase tracking-wider mt-0.5">
                    Corretora Parceira
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Botão de Disparo */}
      <a
        href={corretoresComWhats.length > 1 ? '#' : getSingleOrEscritorioLink()}
        onClick={handleButtonClick}
        target={corretoresComWhats.length > 1 ? undefined : '_blank'}
        rel={corretoresComWhats.length > 1 ? undefined : 'noopener noreferrer'}
        className={`flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Falar no WhatsApp"
      >
        {menuOpen && corretoresComWhats.length > 1 ? (
          <X size={28} className="transform rotate-0 transition-transform duration-300" />
        ) : (
          <MessageCircle size={28} className="animate-pulse group-hover:animate-none" />
        )}
        {/* Tooltip elegante */}
        {!menuOpen && (
          <span className="absolute right-16 bg-stone-900 text-white text-[11px] tracking-wider uppercase font-medium px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-stone-800">
            Falar no WhatsApp
          </span>
        )}
      </a>
    </div>
  );
}
