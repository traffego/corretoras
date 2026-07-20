
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { SystemSettings } from '@/lib/supabase';
import SearchBar from './SearchBar';
import { Corretor } from './CorretoresCarousel';

interface HeroProps {
  settings: SystemSettings;
  bairros: string[];
  condominios: string[];
  corretores?: Corretor[];
}

export default function Hero({ settings, bairros, condominios, corretores = [] }: HeroProps) {
  const getCreciString = () => {
    if (corretores && corretores.length > 0) {
      const activeCrecis = corretores.map(c => c.creci).filter(Boolean);
      if (activeCrecis.length > 0) {
        return activeCrecis.join(' / ');
      }
    }
    return settings.creci;
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-8 pb-16 bg-gradient-to-b from-[#f5eee6] to-[#faf8f5]">
      {/* Elementos decorativos */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Lado Esquerdo: Textos */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Badge de CRECI/Autoridade */}
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-primary/20 px-4 py-2 rounded-full shadow-sm">
            <Award size={16} className="text-primary" />
            <span className="text-[11px] tracking-wider uppercase font-semibold text-secondary">
              {getCreciString()}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-secondary font-bold leading-tight">
            Seu próximo capítulo de <span className="text-primary italic font-normal">alto padrão</span> começa aqui
          </h1>

          <p className="text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed">
            {settings.biografia_curta}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/imoveis"
              className="w-full sm:w-auto text-center bg-secondary text-white hover:bg-stone-850 active:scale-95 px-8 py-4 rounded-full font-medium text-sm tracking-wider uppercase shadow-lg transition duration-300 flex items-center justify-center space-x-2"
            >
              <span>Ver Imóveis</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/sobre-mim"
              className="w-full sm:w-auto text-center border border-secondary/25 hover:border-secondary hover:bg-secondary/5 active:scale-95 px-8 py-4 rounded-full font-medium text-sm tracking-wider uppercase transition duration-300"
            >
              Conhecer Trajetória
            </Link>
          </div>
        </div>

        {/* Lado Direito: Foto da Corretora */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-72 sm:w-80 h-96 sm:h-[450px]">
            {/* Moldura elegante de fundo */}
            <div className="absolute inset-0 border border-primary rounded-t-[10rem] rounded-b-2xl translate-x-4 translate-y-4 -z-10" />
            
            {/* Foto principal */}
            <div className="absolute inset-0 rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl bg-stone-100 border-4 border-white">
              {settings.foto_perfil_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.foto_perfil_url}
                  alt={settings.nome_corretora}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-serif text-lg">
                  Sem Foto
                </div>
              )}
            </div>

            {/* Selo flutuante de experiência */}
            <div className="absolute bottom-6 -left-6 bg-secondary text-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-stone-800">
              <span className="font-serif text-3xl font-bold text-primary leading-none">10+</span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-300 leading-tight">
                Anos de<br />Experiência
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca Integrada */}
      <div className="max-w-6xl mx-auto px-6 w-full mt-16 md:mt-24 relative z-20">
        <SearchBar bairros={bairros} condominios={condominios} />
      </div>
    </section>
  );
}
