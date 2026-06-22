'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Loader2, MailOpen, Calendar, Phone, AlertCircle } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  created_at: string;
  properties?: {
    codigo: string;
    titulo: string;
  } | null;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Buscar leads com a relação para propriedades ( properties (codigo, titulo) )
      const { data, error } = await supabase
        .from('leads')
        .select('id, nome, email, telefone, mensagem, created_at, properties(codigo, titulo)')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMsg('Erro ao buscar leads: ' + error.message);
      } else {
        // Tratar dados para tipagem
        setLeads((data as any) || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro ao se conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente excluir o lead de ${nome}?`)) {
      return;
    }

    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir lead: ' + error.message);
      } else {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Falha ao excluir o lead.');
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200/60 pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
          Leads de Contato
        </h1>
        <p className="text-sm text-stone-500">
          Gerencie os contatos captados pelos formulários públicos do site.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-100 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Listagem */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white border border-stone-200/50 rounded-2xl p-16 text-center space-y-4">
          <h3 className="font-serif text-lg font-bold text-secondary">
            Nenhum lead registrado
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Os contatos enviados pelos clientes através do formulário aparecerão listados aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-stone-200/50 hover:border-primary/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative"
            >
              {/* Informações Básicas do Lead */}
              <div className="lg:col-span-4 space-y-3">
                <div>
                  <span className="text-xs text-stone-400 font-bold tracking-widest uppercase font-mono block">
                    Nome Completo
                  </span>
                  <span className="text-base font-bold text-secondary">{lead.nome}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-stone-600">
                    <MailOpen size={14} className="text-primary flex-shrink-0" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary hover:underline transition">
                      {lead.email}
                    </a>
                  </div>
                  {lead.telefone && (
                    <div className="flex items-center space-x-2 text-xs text-stone-600">
                      <Phone size={14} className="text-primary flex-shrink-0" />
                      <a
                        href={`https://wa.me/${lead.telefone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline transition"
                      >
                        {lead.telefone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-xs text-stone-400">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span>{formatDate(lead.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Mensagem e Imóvel Vinculado */}
              <div className="lg:col-span-7 space-y-3">
                {lead.properties && (
                  <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs">
                    <span className="font-semibold text-primary">Interesse:</span>
                    <span className="text-stone-700">
                      {lead.properties.titulo} ({lead.properties.codigo})
                    </span>
                  </div>
                )}

                <div className="bg-stone-50 border border-stone-200/50 p-4 rounded-xl">
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-stone-400 block mb-1">
                    Mensagem
                  </span>
                  <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed italic">
                    &ldquo;{lead.mensagem}&rdquo;
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="lg:col-span-1 flex lg:justify-end items-center">
                <button
                  onClick={() => handleDelete(lead.id, lead.nome)}
                  className="p-2.5 bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 text-stone-400 hover:text-rose-500 rounded-xl transition cursor-pointer"
                  title="Excluir Lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
