'use client';

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, StarOff, Loader2, Copy } from 'lucide-react';

interface Property {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  finalidade: string;
  preco: number;
  ativo: boolean;
  destaque: boolean;
  bairro: string;
}

export default function AdminImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, codigo, titulo, tipo, finalidade, preco, ativo, destaque, bairro')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMsg('Erro ao carregar imóveis: ' + error.message);
      } else {
        setProperties(data || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Falha ao se conectar com o banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) {
        alert('Erro ao atualizar status: ' + error.message);
      } else {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ativo: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHighlight = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ destaque: !currentStatus })
        .eq('id', id);

      if (error) {
        alert('Erro ao atualizar destaque: ' + error.message);
      } else {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, destaque: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, codigo: string) => {
    if (!confirm(`Deseja realmente excluir o imóvel ${codigo}? Esta ação é permanente.`)) {
      return;
    }

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir imóvel: ' + error.message);
      } else {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Falha ao excluir o imóvel.');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      // Buscar dados completos do imóvel
      const { data: original, error: fetchErr } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchErr || !original) { alert('Erro ao buscar imóvel.'); return; }

      // Buscar imagens
      const { data: imgs } = await supabase
        .from('property_images')
        .select('url, ordem')
        .eq('property_id', id)
        .order('ordem', { ascending: true });

      // Gerar novo código e slug
      const novoCodigo = 'IMV-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const novoTitulo = `${original.titulo} (Cópia)`;
      const novoSlug = original.slug + '-copia-' + Date.now();

      const { id: _id, created_at, ...rest } = original;
      const { data: inserted, error: insertErr } = await supabase
        .from('properties')
        .insert({ ...rest, titulo: novoTitulo, codigo: novoCodigo, slug: novoSlug, ativo: false, destaque: false })
        .select('id')
        .single();
      if (insertErr || !inserted) { alert('Erro ao duplicar: ' + insertErr?.message); return; }

      // Copiar imagens
      if (imgs && imgs.length > 0) {
        await supabase.from('property_images').insert(
          imgs.map(img => ({ property_id: inserted.id, url: img.url, ordem: img.ordem }))
        );
      }

      await fetchProperties();
      alert(`Imóvel duplicado como "${novoTitulo}" (inativo). Edite antes de ativar.`);
    } catch (err) {
      console.error(err);
      alert('Falha ao duplicar.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
            Catálogo de Imóveis
          </h1>
          <p className="text-sm text-stone-500">
            Gerencie as ofertas de imóveis ativos, destaques e listagem geral.
          </p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 active:scale-95 text-white font-semibold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl transition duration-300 shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>Cadastrar Imóvel</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-100 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white border border-stone-200/50 rounded-2xl p-16 text-center space-y-4">
          <h3 className="font-serif text-lg font-bold text-secondary">
            Nenhum imóvel cadastrado
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Clique no botão acima para adicionar sua primeira listagem de alto padrão.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 text-[10px] tracking-wider uppercase font-bold text-stone-400 border-b border-stone-200/60">
                  <th className="py-4 px-6">Código</th>
                  <th className="py-4 px-6">Título</th>
                  <th className="py-4 px-6">Tipo / Finalidade</th>
                  <th className="py-4 px-6">Preço</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Destaque</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-secondary font-medium">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-stone-50/50 transition">
                    {/* Código */}
                    <td className="py-4 px-6 font-mono text-xs text-stone-500">
                      {prop.codigo}
                    </td>
                    {/* Título */}
                    <td className="py-4 px-6">
                      <span className="font-semibold block">{prop.titulo}</span>
                      <span className="text-xs text-stone-400 block mt-0.5">{prop.bairro}</span>
                    </td>
                    {/* Tipo / Finalidade */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded capitalize">
                          {prop.tipo}
                        </span>
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded capitalize">
                          {prop.finalidade}
                        </span>
                      </div>
                    </td>
                    {/* Preço */}
                    <td className="py-4 px-6 text-secondary">
                      {formatPrice(prop.preco)}
                    </td>
                    {/* Ativo */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(prop.id, prop.ativo)}
                        className="inline-flex focus:outline-none cursor-pointer"
                        title={prop.ativo ? 'Clique para Inativar' : 'Clique para Ativar'}
                      >
                        {prop.ativo ? (
                          <CheckCircle2 className="text-emerald-500" size={20} />
                        ) : (
                          <XCircle className="text-stone-300" size={20} />
                        )}
                      </button>
                    </td>
                    {/* Destaque */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleHighlight(prop.id, prop.destaque)}
                        className="inline-flex focus:outline-none cursor-pointer"
                        title={prop.destaque ? 'Remover Destaque' : 'Destacar na Home'}
                      >
                        {prop.destaque ? (
                          <Star className="text-amber-400 fill-amber-400" size={20} />
                        ) : (
                          <StarOff className="text-stone-300" size={20} />
                        )}
                      </button>
                    </td>
                    {/* Ações */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button
                          onClick={() => handleDuplicate(prop.id)}
                          className="p-2 bg-stone-50 border border-stone-200 hover:border-amber-400 hover:text-amber-600 rounded-lg transition cursor-pointer"
                          title="Duplicar"
                        >
                          <Copy size={14} />
                        </button>
                        <Link
                          href={`/admin/imoveis/editar/${prop.id}`}
                          className="p-2 bg-stone-50 border border-stone-200 hover:border-primary hover:text-primary rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop.id, prop.codigo)}
                          className="p-2 bg-stone-50 border border-stone-200 hover:border-rose-500 hover:text-rose-500 rounded-lg transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
