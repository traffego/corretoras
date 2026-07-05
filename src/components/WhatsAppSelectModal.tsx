'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User } from 'lucide-react';

interface Corretor {
  nome: string;
  whatsapp?: string | null;
  foto_url?: string | null;
}

interface WhatsAppSelectModalProps {
  open: boolean;
  onClose: () => void;
  corretores: Corretor[];
  settings: {
    whatsapp: string;
    nome_corretora: string;
  };
}

export default function WhatsAppSelectModal({
  open,
  onClose,
  corretores,
  settings,
}: WhatsAppSelectModalProps) {
  const [mounted, setMounted] = useState(false);

  // Monitorar montagem do componente no cliente
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!open || !mounted) return null;

  // Filtrar corretores ativos que possuem WhatsApp cadastrado
  const corretoresComWhats = corretores.filter((c) => c.whatsapp && c.whatsapp.trim() !== '');

  const getWhatsLink = (num: string, nome?: string) => {
    const cleanNum = num.replace(/\D/g, '');
    const saudacao = nome ? `Olá%20${nome.split(' ')[0]}` : 'Olá';
    return `https://wa.me/${cleanNum}?text=${saudacao},%20vi%20o%20seu%20site%20imobiliário%20e%20gostaria%20de%20conversar.`;
  };

  const handleSelect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop com z-index alto para garantir que cubra tudo */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Janela do Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 z-[1000000]">
        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
            Atendimento Exclusivo
          </span>
          <h2 className="font-serif text-2xl font-bold text-secondary">
            Falar pelo WhatsApp
          </h2>
          <p className="text-xs text-stone-500">
            Escolha uma das corretoras para iniciar a conversa.
          </p>
        </div>

        {/* Lista de Opções */}
        <div className="space-y-2">
          {corretoresComWhats.map((c, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(getWhatsLink(c.whatsapp!, c.nome))}
              className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-stone-200/60 hover:border-primary hover:bg-primary/5 text-left transition duration-300 group cursor-pointer focus:outline-none"
            >
              {/* Foto / Avatar */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-stone-200 border border-stone-100 flex-shrink-0 flex items-center justify-center text-stone-500">
                {c.foto_url ? (
                  <img src={c.foto_url} alt={c.nome} className="w-full h-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>
              
              {/* Informações */}
              <div className="flex-grow leading-tight">
                <span className="block text-sm font-semibold text-secondary group-hover:text-primary transition">
                  {c.nome}
                </span>
                <span className="text-[10px] text-stone-400">
                  Corretora Parceira
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-[10px] text-stone-400">
          Você será redirecionado com segurança para o aplicativo do WhatsApp.
        </p>
      </div>
    </div>,
    document.body
  );
}
