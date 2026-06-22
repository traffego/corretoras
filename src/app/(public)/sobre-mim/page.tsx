import Image from 'next/image';
import Link from 'next/link';
import { Award, Briefcase, Heart, Shield, Phone } from 'lucide-react';
import { getSettings } from '@/lib/supabase';

export const metadata = {
  title: 'Sobre Mim',
  description: 'Conheça Gabriela Mateos, especialista em intermediação imobiliária de alto padrão.',
};

export default async function SobreMimPage() {
  const settings = await getSettings();

  const values = [
    {
      icon: <Shield className="text-primary" size={24} />,
      title: 'Segurança Jurídica',
      description: 'Garantimos transparência absoluta e assessoria detalhada em todas as fases do negócio.',
    },
    {
      icon: <Award className="text-primary" size={24} />,
      title: 'Excelência em Serviço',
      description: 'Atendimento consultivo e personalizado de alto nível para investidores e famílias.',
    },
    {
      icon: <Briefcase className="text-primary" size={24} />,
      title: 'Curadoria Exclusiva',
      description: 'Foco apenas em imóveis com alto potencial de valorização e excelente padrão construtivo.',
    },
    {
      icon: <Heart className="text-primary" size={24} />,
      title: 'Relacionamento de Confiança',
      description: 'Construímos conexões sólidas e duradouras com discrição e ética profissional.',
    },
  ];

  const formatWhatsAppLink = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=Olá,%20vi%20sua%20página%20de%20biografia%20e%20gostaria%20de%20conversar.`;
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Hero da Bio */}
      <section className="bg-gradient-to-b from-[#f5eee6] to-[#faf8f5] py-20 border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Foto da Corretora */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-80 h-96 sm:h-[420px]">
              {/* Borda decorativa */}
              <div className="absolute inset-0 border border-primary rounded-t-[10rem] rounded-b-2xl translate-x-4 translate-y-4 -z-10" />
              <div className="absolute inset-0 rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl bg-white border-4 border-white">
                {settings.foto_perfil_url ? (
                  <Image
                    src={settings.foto_perfil_url}
                    alt={settings.nome_corretora}
                    fill
                    priority
                    sizes="(max-w-768px) 100vw, 400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-serif">
                    Sem Foto
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nome e Apresentação Curta */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
                Apresentação Profissional
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-secondary">
                {settings.nome_corretora}
              </h1>
              <div className="inline-flex items-center space-x-1.5 text-xs text-stone-500 bg-stone-200/50 px-3 py-1 rounded-md">
                <Award size={14} className="text-primary" />
                <span>{settings.creci}</span>
              </div>
            </div>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-medium italic">
              &ldquo;{settings.biografia_curta}&rdquo;
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {settings.biografia_longa}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Nossos Valores */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
            Princípios
          </span>
          <h2 className="font-serif text-3xl font-bold text-secondary">
            Compromisso com o Cliente
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-stone-200/50 shadow-sm flex flex-col space-y-4 hover:shadow-md transition duration-300"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                {val.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-secondary">
                {val.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Banner CTA de Fale Conosco */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden border border-stone-800 shadow-xl">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Vamos encontrar o seu imóvel ideal juntos?
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed">
              Estou à disposição para fazer uma consultoria particular, entendendo sua demanda e buscando ativamente a propriedade que preenche todos os seus requisitos de qualidade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href={formatWhatsAppLink(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-primary text-white hover:opacity-90 active:scale-95 px-8 py-4 rounded-full font-medium text-sm tracking-wider uppercase shadow-md transition duration-300 flex items-center justify-center space-x-2"
            >
              <Phone size={16} />
              <span>Entrar em contato</span>
            </a>
            <Link
              href="/contato"
              className="w-full sm:w-auto text-center border border-stone-700 hover:border-stone-500 hover:bg-stone-850 px-8 py-4 rounded-full font-medium text-sm tracking-wider uppercase transition duration-300"
            >
              Enviar Mensagem
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
