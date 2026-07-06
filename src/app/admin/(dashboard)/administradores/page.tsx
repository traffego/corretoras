'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Plus, Trash2, Mail, Lock, AlertCircle, CheckCircle2, User, Loader2 } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdministradoresPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      setCurrentUser(session.user);

      const res = await fetch('/api/admin/list-users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        setErrorMsg(data.error || 'Erro ao carregar administradores.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Falha de conexão ao carregar administradores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada');

      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(`Administrador ${email} criado com sucesso!`);
        setEmail('');
        setPassword('');
        setShowAddForm(false);
        fetchUsers(); // Recarregar lista
      } else {
        setErrorMsg(data.error || 'Erro ao criar administrador.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao criar administrador.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (userId: string, userEmail: string) => {
    if (userId === currentUser?.id) {
      alert('Você não pode excluir o seu próprio usuário.');
      return;
    }

    if (!confirm(`Deseja realmente remover o acesso administrador de ${userEmail}?`)) {
      return;
    }

    setDeletingId(userId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada');

      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('Administrador removido com sucesso.');
        fetchUsers(); // Recarregar lista
      } else {
        setErrorMsg(data.error || 'Erro ao remover administrador.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao remover administrador.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
            Administradores
          </h1>
          <p className="text-xs text-stone-400">
            Gerencie os usuários com acesso total ao painel administrativo.
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 active:scale-95 text-white px-5 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase shadow-sm transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Novo Admin</span>
          </button>
        )}
      </div>

      {/* Alertas */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 flex items-start space-x-2.5 text-xs">
          <AlertCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4 flex items-start space-x-2.5 text-xs">
          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Formulário de Adicionar Administrador */}
      {showAddForm && (
        <div className="bg-white border border-stone-200/50 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
            <h2 className="font-serif text-lg font-bold text-secondary">
              Adicionar Novo Administrador
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-stone-400 hover:text-stone-600 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-stone-300 text-white px-6 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Criar Acesso</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Administradores */}
      <div className="bg-white border border-stone-200/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 size={24} className="text-primary animate-spin" />
            <span className="text-xs text-stone-400">Carregando administradores...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <User className="text-stone-300 mx-auto" size={40} />
            <h3 className="font-serif text-lg font-bold text-secondary">
              Nenhum administrador
            </h3>
            <p className="text-xs text-stone-400">
              Parece que não há administradores listados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                  <th className="px-6 py-4">Usuário / E-mail</th>
                  <th className="px-6 py-4">Criado em</th>
                  <th className="px-6 py-4">Último Acesso</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm text-stone-600">
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/50 transition">
                      <td className="px-6 py-4 font-medium text-secondary">
                        <div className="flex items-center space-x-2">
                          <span>{u.email}</span>
                          {isSelf && (
                            <span className="text-[9px] bg-stone-100 text-stone-500 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Você
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-400">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-400">
                        {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : 'Nunca acessou'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteAdmin(u.id, u.email)}
                          disabled={isSelf || deletingId === u.id}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 disabled:text-stone-200 disabled:bg-transparent rounded-lg transition cursor-pointer"
                          title={isSelf ? 'Você não pode excluir o seu próprio usuário' : 'Excluir Administrador'}
                        >
                          {deletingId === u.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
