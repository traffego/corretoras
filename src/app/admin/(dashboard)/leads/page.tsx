'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Loader2, Phone, Home, Building2, MessageSquare, Calendar, ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  email?: string | null;
  telefone: string;
  mensagem?: string | null;
  interesse: 'geral' | 'imovel' | null;
  imovel_id?: string | null;
  imovel_codigo?: string | null;
  imovel_titulo?: string | null;
  origem?: string | null;
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'geral' | 'imovel'>('todos');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, properties(codigo, titulo)')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMsg('Erro ao buscar leads: ' + error.message);
      } else {
        const mappedLeads = (data || []).map((lead: any) => ({
          ...lead,
          interesse: lead.property_id ? 'imovel' : 'geral',
          imovel_codigo: lead.properties?.codigo || null,
          imovel_titulo: lead.properties?.titulo || null,
        })) as Lead[];
        setLeads(mappedLeads);
      }
    } catch (err) {
      setErrorMsg('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este lead permanentemente?')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filtered = leads.filter(l => filtro === 'todos' ? true : (l.interesse || 'geral') === filtro);

  const countGeral = leads.filter(l => !l.interesse || l.interesse === 'geral').length;
  const countImovel = leads.filter(l => l.interesse === 'imovel').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200/60 pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">Leads Capturados</h1>
        <p className="text-sm text-stone-500 mt-1">Clientes que demonstraram interesse via WhatsApp ou formulário.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: leads.length, icon: <MessageSquare size={18} />, color: 'text-stone-600 bg-stone-100' },
          { label: 'Interesse Geral', value: countGeral, icon: <Home size={18} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Imóvel Específico', value: countImovel, icon: <Building2 size={18} />, color: 'text-primary bg-primary/10' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-200/50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
            <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-serif font-bold text-secondary">{s.value}</div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-2">
        {(['todos', 'geral', 'imovel'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              filtro === f ? 'bg-primary text-white shadow-sm' : 'bg-white border border-stone-200 text-stone-500 hover:border-primary hover:text-primary'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'geral' ? 'Interesse Geral' : 'Imóvel Específico'}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-100 text-sm">{errorMsg}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-stone-200/50 rounded-2xl p-16 text-center space-y-2">
          <h3 className="font-serif text-lg font-bold text-secondary">Nenhum lead encontrado</h3>
          <p className="text-sm text-stone-500">Os leads aparecerão aqui quando clientes interagirem com os botões do site.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[10px] tracking-widest uppercase font-bold text-stone-400 border-b border-stone-100">
                  <th className="py-4 px-5">Nome</th>
                  <th className="py-4 px-5">Contato</th>
                  <th className="py-4 px-5">Interesse</th>
                  <th className="py-4 px-5">Imóvel</th>
                  <th className="py-4 px-5">Data</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-4 px-5 font-semibold text-secondary">{lead.nome}</td>
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <a
                          href={`https://wa.me/${lead.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          <Phone size={13} />
                          <span>{lead.telefone}</span>
                        </a>
                        {lead.email && (
                          <span className="text-xs text-stone-400 block">{lead.email}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {!lead.interesse || lead.interesse === 'geral' ? (
                        <span className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          <Home size={11} /><span>Geral</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          <Building2 size={11} /><span>Imóvel</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {lead.imovel_codigo ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs text-stone-400">{lead.imovel_codigo}</span>
                          <span className="text-xs text-stone-600 block truncate max-w-[160px]">{lead.imovel_titulo}</span>
                        </div>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-1.5 text-xs text-stone-400">
                        <Calendar size={12} />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 bg-stone-50 border border-stone-200 hover:border-rose-300 hover:text-rose-500 rounded-lg transition cursor-pointer"
                        title="Remover lead"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
