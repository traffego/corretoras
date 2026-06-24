'use client';

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Home, Mail, Settings, LogOut, Loader2, Menu, X } from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push('/admin');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const menuItems = [
    { name: 'Imóveis', href: '/admin/imoveis', icon: <Home size={18} /> },
    { name: 'Leads de Contato', href: '/admin/leads', icon: <Mail size={18} /> },
    { name: 'Configurações', href: '/admin/configuracoes', icon: <Settings size={18} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-500 space-y-4">
        <Loader2 size={36} className="animate-spin text-primary" />
        <span className="text-sm font-semibold tracking-wider uppercase">
          Carregando Painel Administrativo...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-stone-900 text-white py-4 px-6 flex items-center justify-between border-b border-stone-800 sticky top-0 z-40">
        <span className="font-serif text-lg tracking-widest font-bold text-primary">
          PAINEL ADMIN
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-stone-300 hover:text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`bg-stone-900 text-stone-300 w-full md:w-64 flex flex-col justify-between border-r border-stone-800 md:min-h-screen transition-all duration-300 md:sticky md:top-0 z-30 ${
          isSidebarOpen ? 'block fixed inset-x-0 top-[60px] bottom-0' : 'hidden md:flex'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="hidden md:block">
            <span className="font-serif text-xl tracking-widest font-bold text-white block">
              PAINEL ADMIN
            </span>
            <span className="text-[9px] tracking-[0.25em] text-primary font-semibold uppercase mt-0.5 block">
              IMÓVEIS SELECIONADOS
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-300 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'hover:bg-stone-800 hover:text-white text-stone-400'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout / Bottom */}
        <div className="p-6 border-t border-stone-800 space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold hover:bg-rose-900/20 text-stone-400 hover:text-rose-450 transition duration-300 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sair do Painel</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-center space-x-1.5 w-full text-center text-[10px] tracking-widest uppercase font-bold text-stone-500 hover:text-primary py-2 transition"
          >
            <LayoutDashboard size={12} />
            <span>Ver Site Público</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
