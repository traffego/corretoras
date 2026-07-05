'use client';

import { useState } from 'react';
import LeadModal, { type LeadContext } from './LeadModal';
import { MessageCircle } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';

interface Corretor {
  id?: string;
  nome: string;
  whatsapp?: string | null;
  foto_url?: string | null;
}

interface WhatsAppLeadButtonProps {
  whatsLink: string;
  context: LeadContext;
  label?: string;
  className?: string;
  fullWidth?: boolean;
  corretores?: Corretor[];
  settings?: SystemSettings;
}

export default function WhatsAppLeadButton({
  whatsLink,
  context,
  label = 'Falar pelo WhatsApp',
  className = '',
  fullWidth = false,
  corretores = [],
  settings,
}: WhatsAppLeadButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirm = (_nome: string, _telefone: string, corretorSelecionado?: Corretor) => {
    setModalOpen(false);
    
    let targetLink = whatsLink;

    // Redirecionar para o WhatsApp do corretor selecionado
    if (corretorSelecionado && corretorSelecionado.whatsapp) {
      const cleanNum = corretorSelecionado.whatsapp.replace(/\D/g, '');
      const saudacao = `Olá%20${corretorSelecionado.nome.split(' ')[0]}`;
      let msg = `${saudacao},%20vi%20o%20seu%20site%20imobiliário%20e%20gostaria%20de%20conversar.`;

      // Mensagem personalizada se for interesse em um imóvel específico
      if (context.tipo === 'imovel') {
        const codigo = context.imovelCodigo || '';
        const titulo = context.imovelTitulo || '';
        msg = `${saudacao},%20estou%20interessado%20no%20imóvel%20código%20${codigo}%20(${titulo})%20e%20gostaria%20de%20receber%20mais%20informações.`;
      }

      targetLink = `https://wa.me/${cleanNum}?text=${msg}`;
    }

    window.open(targetLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-medium text-xs tracking-wider uppercase py-4 rounded-xl shadow-md transition duration-300 cursor-pointer ${className}`}
      >
        <MessageCircle size={16} />
        <span>{label}</span>
      </button>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        context={context}
        actionLabel="Abrir WhatsApp"
        actionIcon={<MessageCircle size={16} />}
        corretores={corretores}
      />
    </>
  );
}
