'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus, Trash2, Loader2, Save, X, GripVertical,
  CheckCircle2, AlertCircle, User, Upload,
} from 'lucide-react';
import Image from 'next/image';

interface Corretor {
  id: string;
  nome: string;
  creci: string;
  biografia_curta: string;
  biografia_longa: string;
  foto_url: string;
  especialidade: string;
  ordem: number;
  ativo: boolean;
}

const EMPTY: Omit<Corretor, 'id' | 'ordem' | 'ativo'> = {
  nome: '',
  creci: '',
  biografia_curta: '',
  biografia_longa: '',
  foto_url: '',
  especialidade: '',
};

export default function AdminCorretoresPage() {
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchCorretores = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('corretores')
      .select('*')
      .order('ordem', { ascending: true });
    setCorretores(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCorretores(); }, []);

  const openNew = () => {
    setEditingId('new');
    setForm({ ...EMPTY });
    setError('');
    setSuccess('');
  };

  const openEdit = (c: Corretor) => {
    setEditingId(c.id);
    setForm({
      nome: c.nome,
      creci: c.creci || '',
      biografia_curta: c.biografia_curta || '',
      biografia_longa: c.biografia_longa || '',
      foto_url: c.foto_url || '',
      especialidade: c.especialidade || '',
    });
    setError('');
    setSuccess('');
  };

  const closeForm = () => { setEditingId(null); setError(''); setSuccess(''); };

  const handleSave = async () => {
    if (!form.nome.trim()) { setError('Nome é obrigatório.'); return; }
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingId === 'new') {
        const maxOrdem = corretores.length > 0 ? Math.max(...corretores.map(c => c.ordem)) + 1 : 0;
        const { error: e } = await supabase.from('corretores').insert({
          ...form,
          ordem: maxOrdem,
          ativo: true,
        });
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('corretores').update(form).eq('id', editingId);
        if (e) throw e;
      }
      setSuccess('Salvo com sucesso!');
      await fetchCorretores();
      setTimeout(closeForm, 800);
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este corretor?')) return;
    await supabase.from('corretores').delete().eq('id', id);
    fetchCorretores();
  };

  const handleToggleAtivo = async (c: Corretor) => {
    await supabase.from('corretores').update({ ativo: !c.ativo }).eq('id', c.id);
    fetchCorretores();
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = editingId === 'new' ? 'tmp_' + Date.now() : editingId!;
    setUploadingId(id);
    const ext = file.name.split('.').pop();
    const path = `corretores/${id}.${ext}`;
    const { error: upErr } = await supabase.storage.from('imoveis').upload(path, file, { upsert: true });
    if (upErr) { setError('Erro no upload: ' + upErr.message); setUploadingId(null); return; }
    const { data } = supabase.storage.from('imoveis').getPublicUrl(path);
    setForm(f => ({ ...f, foto_url: data.publicUrl }));
    setUploadingId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">Corretores</h1>
          <p className="text-sm text-stone-500 mt-1">Gerencie os corretores exibidos na página "Sobre Nós".</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 active:scale-95 text-white font-semibold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl transition duration-300 shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>Novo Corretor</span>
        </button>
      </div>

      {/* Formulário modal inline */}
      {editingId && (
        <div className="bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-secondary">
              {editingId === 'new' ? 'Novo Corretor' : 'Editar Corretor'}
            </h2>
            <button onClick={closeForm} className="p-2 hover:bg-stone-100 rounded-lg transition"><X size={18} /></button>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-100 text-sm flex items-center space-x-2">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-sm flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Nome *</label>
              <input
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Ex: Patrícia Silva"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">CRECI</label>
              <input
                value={form.creci}
                onChange={e => setForm(f => ({ ...f, creci: e.target.value }))}
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Ex: CRECI 12345-F"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Especialidade</label>
              <input
                value={form.especialidade}
                onChange={e => setForm(f => ({ ...f, especialidade: e.target.value }))}
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Ex: Alto Padrão e Condomínios"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Foto</label>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {form.foto_url ? (
                    <Image src={form.foto_url} alt="foto" width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <User size={20} className="text-stone-400" />
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUploadFoto} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={!!uploadingId}
                  className="flex items-center space-x-1.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs px-3.5 py-2.5 rounded-lg font-semibold tracking-wide cursor-pointer transition"
                >
                  {uploadingId ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploadingId ? 'Carregando...' : 'Carregar Foto'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Frase Curta</label>
            <input
              value={form.biografia_curta}
              onChange={e => setForm(f => ({ ...f, biografia_curta: e.target.value }))}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Uma frase de impacto para apresentação"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Biografia Completa</label>
            <textarea
              value={form.biografia_longa}
              onChange={e => setForm(f => ({ ...f, biografia_longa: e.target.value }))}
              rows={5}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none"
              placeholder="Trajetória profissional detalhada..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-xl text-sm font-semibold text-stone-600 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 disabled:bg-stone-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-md cursor-pointer"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Salvar</span>
            </button>
          </div>
        </div>
      )}

      {/* Lista de corretores */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : corretores.length === 0 ? (
        <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-16 text-center space-y-3">
          <User size={40} className="text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-secondary">Nenhum corretor cadastrado</h3>
          <p className="text-sm text-stone-400">Clique em "Novo Corretor" para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {corretores.map((c) => (
            <div
              key={c.id}
              className={`bg-white border rounded-2xl p-5 flex items-center space-x-4 shadow-sm transition ${
                c.ativo ? 'border-stone-200/50' : 'border-stone-200/50 opacity-50'
              }`}
            >
              <GripVertical size={18} className="text-stone-300 flex-shrink-0" />

              {/* Foto */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                {c.foto_url ? (
                  <Image src={c.foto_url} alt={c.nome} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={20} className="text-stone-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-secondary text-sm truncate">{c.nome}</p>
                <p className="text-[11px] text-stone-400 truncate">{c.creci || '—'} {c.especialidade ? `• ${c.especialidade}` : ''}</p>
              </div>

              {/* Status */}
              <button
                onClick={() => handleToggleAtivo(c)}
                className={`text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full transition ${
                  c.ativo ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {c.ativo ? 'Ativo' : 'Inativo'}
              </button>

              {/* Ações */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEdit(c)}
                  className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-secondary transition"
                  title="Editar"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 hover:bg-rose-50 rounded-lg text-stone-400 hover:text-rose-600 transition"
                  title="Excluir"
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
