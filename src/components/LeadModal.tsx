'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface LeadContext {
  tipo: 'geral' | 'imovel';
  imovelId?: string;
  imovelCodigo?: string;
  imovelTitulo?: string;
}

interface Corretor {
  id?: string;
  nome: string;
  whatsapp?: string | null;
  foto_url?: string | null;
}

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string, telefone: string, corretorSelecionado?: Corretor) => void;
  context: LeadContext;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  corretores?: Corretor[];
}

export default function LeadModal({
  open,
  onClose,
  onConfirm,
  context,
  actionLabel = 'Continuar',
  actionIcon,
  corretores = [],
}: LeadModalProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Monitorar montagem do componente no cliente
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Filtrar corretores ativos que possuem WhatsApp
  const corretoresComWhats = corretores.filter((c) => c.whatsapp && c.whatsapp.trim() !== '');

  // Estado para corretor selecionado (começa pré-selecionado com o primeiro)
  const [corretorSelecionado, setCorretorSelecionado] = useState<Corretor | null>(null);

  // Inicializar o corretor selecionado
  useEffect(() => {
    if (corretoresComWhats.length > 0) {
      setCorretorSelecionado(corretoresComWhats[0]);
    }
  }, [corretores]);

  if (!open || !mounted) return null;

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

    const mensagemLead = corretorSelecionado
      ? `Direcionado para a corretora: ${corretorSelecionado.nome}`
      : 'Atendimento via WhatsApp central';

    try {
      await supabase.from('leads').insert({
        nome: nome.trim(),
        telefone: telefone.trim(),
        interesse: context.tipo,
        imovel_id: context.imovelId || null,
        imovel_codigo: context.imovelCodigo || null,
        imovel_titulo: context.imovelTitulo || null,
        origem: typeof window !== 'undefined' ? window.location.pathname : null,
        mensagem: mensagemLead,
      });
    } catch {
      // Salvar falhou — continua mesmo assim para não bloquear o usuário
    }

    setSaving(false);
    setDone(true);

    setTimeout(() => {
      onConfirm(nome.trim(), telefone.trim(), corretorSelecionado || undefined);
      // Reset
      setNome('');
      setTelefone('');
      setDone(false);
    }, 600);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200 z-[1000000]">
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

            {/* Escolha do Atendimento (Seletor premium se houver mais de uma corretora com whats) */}
            {corretoresComWhats.length > 1 && (
              <div className="flex flex-col space-y-2 pt-1">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                  Falar Com *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {corretoresComWhats.map((c, idx) => (
                    <button
                      key={c.id || idx}
                      type="button"
                      onClick={() => setCorretorSelecionado(c)}
                      className={`flex items-center space-x-2.5 p-3 rounded-2xl border text-left transition duration-300 focus:outline-none cursor-pointer ${
                        corretorSelecionado?.whatsapp === c.whatsapp
                          ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm shadow-primary/5'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 flex-shrink-0 flex items-center justify-center text-stone-500 border border-stone-100">
                        {c.foto_url ? (
                          <img src={c.foto_url} alt={c.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User size={12} />
                        )}
                      </div>
                      <div className="leading-tight">
                        <span className="block text-xs font-semibold text-stone-800">
                          {c.nome.split(' ')[0]}
                        </span>
                        <span className="text-[9px] text-stone-400 font-sans tracking-wide">
                          Corretora
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:opacity-90 disabled:opacity-60 text-white font-semibold text-sm py-3.5 rounded-xl transition cursor-pointer shadow-md mt-6"
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

            <p className="text-center text-[10px] text-stone-400 pt-2">
              Seus dados são usados apenas para atendimento. Não compartilhamos com terceiros.
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
