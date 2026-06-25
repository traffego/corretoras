'use client';

import { useState } from 'react';
import { X, User, Phone, Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface LeadContext {
  tipo: 'geral' | 'imovel';
  imovelId?: string;
  imovelCodigo?: string;
  imovelTitulo?: string;
}

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string, telefone: string) => void;
  context: LeadContext;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

export default function LeadModal({
  open,
  onClose,
  onConfirm,
  context,
  actionLabel = 'Continuar',
  actionIcon,
}: LeadModalProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const formatTelefone = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      setError('Preencha seu nome e telefone para continuar.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      await supabase.from('leads').insert({
        nome: nome.trim(),
        telefone: telefone.trim(),
        interesse: context.tipo,
        imovel_id: context.imovelId || null,
        imovel_codigo: context.imovelCodigo || null,
        imovel_titulo: context.imovelTitulo || null,
        origem: typeof window !== 'undefined' ? window.location.pathname : null,
      });
    } catch {
      // Salvar falhou — continua mesmo assim para não bloquear o usuário
    }

    setSaving(false);
    setDone(true);

    setTimeout(() => {
      onConfirm(nome.trim(), telefone.trim());
      // Reset
      setNome('');
      setTelefone('');
      setDone(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">
            {context.tipo === 'imovel' ? 'Interesse no imóvel' : 'Atendimento'}
          </p>
          <h2 className="font-serif text-2xl font-bold text-secondary">
            Quase lá!
          </h2>
          {context.imovelTitulo ? (
            <p className="text-sm text-stone-500">
              Deixe seu contato para falar sobre <strong className="text-secondary">{context.imovelTitulo}</strong>.
            </p>
          ) : (
            <p className="text-sm text-stone-500">
              Deixe seu contato para receber atendimento exclusivo.
            </p>
          )}
        </div>

        {done ? (
          <div className="flex flex-col items-center py-6 space-y-3 text-emerald-600">
            <CheckCircle2 size={40} />
            <span className="font-semibold text-sm">Perfeito! Redirecionando...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Nome */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Seu Nome *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  autoFocus
                  type="text"
                  required
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Como devemos te chamar?"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Telefone / WhatsApp *
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={telefone}
                  onChange={e => setTelefone(formatTelefone(e.target.value))}
                  placeholder="(00) 99999-9999"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:opacity-90 disabled:opacity-60 text-white font-semibold text-sm py-3.5 rounded-xl transition cursor-pointer shadow-md"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {actionIcon}
                  <span>{actionLabel}</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-stone-400">
              Seus dados são usados apenas para atendimento. Não compartilhamos com terceiros.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
