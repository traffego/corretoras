import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';

interface FooterProps {
  settings: SystemSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const formatWhatsAppNumber = (num: string) => {
    // Adiciona máscara simples se for no padrão BR (ex: 66 99999-9999)
    const cleanNum = num.replace(/\D/g, '');
    let display = num;
    if (cleanNum.length === 13 && cleanNum.startsWith('55')) {
      const parts = cleanNum.slice(2);
      display = `(${parts.slice(0, 2)}) ${parts.slice(2, 7)}-${parts.slice(7)}`;
    }
    return {
      link: `https://wa.me/${cleanNum}`,
      display,
    };
  };

  const whatsInfo = formatWhatsAppNumber(settings.whatsapp);

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Principal Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Col 1: Logo & Bio */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl tracking-widest font-bold text-white">
              {settings.nome_corretora.toUpperCase()}
            </span>
            <span className="block text-[8px] font-sans tracking-[0.25em] text-primary font-medium mt-0.5 uppercase">
              Imóveis Exclusivos
            </span>
          </Link>
          <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
            {settings.biografia_curta}
          </p>
          <div className="inline-flex items-center space-x-2 text-xs text-stone-500 bg-stone-800/50 px-3 py-1.5 rounded">
            <ShieldAlert size={12} className="text-primary" />
            <span>{settings.creci}</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-medium text-white tracking-wide">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-primary transition duration-300">
                Início
              </Link>
            </li>
            <li>
              <Link href="/imoveis" className="hover:text-primary transition duration-300">
                Imóveis Disponíveis
              </Link>
            </li>
            <li>
              <Link href="/sobre-mim" className="hover:text-primary transition duration-300">
                Sobre Mim
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-primary transition duration-300">
                Fale Conosco
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Categorias */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-medium text-white tracking-wide">
            Imóveis
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/imoveis?tipo=casa" className="hover:text-primary transition duration-300">
                Casas de Luxo
              </Link>
            </li>
            <li>
              <Link href="/imoveis?tipo=sobrado" className="hover:text-primary transition duration-300">
                Sobrados Modernos
              </Link>
            </li>
            <li>
              <Link href="/imoveis?tipo=apartamento" className="hover:text-primary transition duration-300">
                Apartamentos Exclusivos
              </Link>
            </li>
            <li>
              <Link href="/imoveis?tipo=terreno" className="hover:text-primary transition duration-300">
                Terrenos em Condomínio
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contatos */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-medium text-white tracking-wide">
            Contatos
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <a
                href={whatsInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition duration-300"
              >
                {whatsInfo.display}
              </a>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <a
                href={`mailto:${settings.email_destino}`}
                className="hover:text-primary transition duration-300 break-all"
              >
                {settings.email_destino}
              </a>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-stone-400">
                Atendimento na região e condomínios fechados
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="border-t border-stone-800 py-8 text-center text-xs text-stone-500 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; {currentYear} {settings.nome_corretora}. Todos os direitos reservados.
          </div>
          <div className="flex space-x-4">
            <Link href="/admin" className="hover:text-primary transition duration-300">
              Painel Restrito (Admin)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
