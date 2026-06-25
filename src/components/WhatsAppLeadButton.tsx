'use client';

import { useState } from 'react';
import LeadModal, { type LeadContext } from './LeadModal';
import { MessageCircle } from 'lucide-react';

interface WhatsAppLeadButtonProps {
  whatsLink: string;
  context: LeadContext;
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function WhatsAppLeadButton({
  whatsLink,
  context,
  label = 'Falar pelo WhatsApp',
  className = '',
  fullWidth = false,
}: WhatsAppLeadButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirm = (_nome: string, _telefone: string) => {
    setModalOpen(false);
    window.open(whatsLink, '_blank', 'noopener,noreferrer');
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
      />
    </>
  );
}
