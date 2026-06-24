'use client';

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Verificar se o usuário já está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/imoveis');
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Credenciais inválidas. Tente novamente.');
      } else if (data.session) {
        router.push('/admin/imoveis');
      }
    } catch (err: any) {
      console.error('Erro no login admin:', err);
      setErrorMsg('Ocorreu um erro no servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500 font-medium text-sm">
        Verificando credenciais...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-stone-200/50 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-primary/10 rounded-2xl text-primary mb-2">
            <Lock size={24} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-secondary">
            Painel Administrativo
          </h1>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
            Área de Acesso Restrito
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 flex items-start space-x-2.5 text-xs">
            <AlertCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* E-mail */}
          <div className="flex flex-col">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="flex flex-col">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-stone-850 disabled:bg-stone-400 text-white font-medium text-xs tracking-wider uppercase py-4 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
          >
            {loading ? <span>Autenticando...</span> : <span>Entrar no Painel</span>}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-stone-500 hover:text-primary transition"
          >
            Voltar para o site público
          </button>
        </div>
      </div>
    </div>
  );
}
