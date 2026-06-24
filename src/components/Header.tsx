'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';

interface HeaderProps {
  settings: SystemSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Imóveis', href: '/imoveis' },
    { name: 'Sobre Mim', href: '/sobre-mim' },
    { name: 'Contato', href: '/contato' },
  ];

  const formatWhatsAppLink = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=Olá,%20gostaria%20de%20obter%20mais%20informações.`;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Name */}
        <Link href="/" className="flex items-center space-x-3 group">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={settings.nome_corretora}
              className={`h-16 w-auto object-contain ${
                settings.logo_url === '/logo.png' || settings.logo_url.includes('logo.png')
                  ? 'brightness-0'
                  : ''
              }`}
            />
          ) : (
            <span className="font-serif text-2xl tracking-widest font-bold text-secondary group-hover:text-primary transition duration-300">
              {settings.nome_corretora.toUpperCase()}
              <span className="block text-[9px] font-sans tracking-[0.25em] text-primary font-medium mt-0.5">
                NEGÓCIOS IMOBILIÁRIOS
              </span>
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wider uppercase font-medium transition duration-300 ${
                  isActive
                    ? 'text-primary border-b border-primary pb-1'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden md:block">
          <a
            href={formatWhatsAppLink(settings.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-primary text-white hover:opacity-90 active:scale-95 font-medium text-xs tracking-wider uppercase px-6 py-3 rounded-full transition duration-300 shadow-md"
          >
            <Phone size={14} />
            <span>Falar com Corretora</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-secondary hover:text-primary p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-stone-200/50 absolute top-full left-0 w-full py-6 px-6 space-y-4 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-5">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm tracking-wider uppercase font-semibold py-2 transition duration-300 ${
                    isActive ? 'text-primary pl-2 border-l-2 border-primary' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href={formatWhatsAppLink(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 bg-primary text-white font-medium text-sm tracking-wider uppercase py-3 rounded-full shadow-md w-full"
            >
              <Phone size={16} />
              <span>Falar com Corretora</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
