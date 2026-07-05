export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Award, Briefcase, Heart, Shield, Phone } from 'lucide-react';
import { getSettings, supabase } from '@/lib/supabase';
import CorretoresCarousel, { Corretor } from '@/components/CorretoresCarousel';
import WhatsAppLeadButton from '@/components/WhatsAppLeadButton';

export const metadata = {
  title: 'Sobre Nós',
  description: 'Conheça nossa equipe de corretores especializados em intermediação imobiliária de alto padrão.',
};

export default async function SobreMimPage() {
  const settings = await getSettings();

  // Buscar corretores ativos ordenados
  const { data: corretoresData } = await supabase
    .from('corretores')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  // Fallback: se não houver corretores no banco, usa os dados de settings
  const corretores: Corretor[] =
    corretoresData && corretoresData.length > 0
      ? corretoresData
      : [
          {
            id: 'fallback',
            nome: settings.nome_corretora,
            creci: settings.creci,
            biografia_curta: settings.biografia_curta,
            biografia_longa: settings.biografia_longa,
            foto_url: settings.foto_perfil_url,
            especialidade: null,
          },
        ];

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
      {/* 1. Header com Carrossel de Corretores */}
      <section className="bg-gradient-to-b from-[#f5eee6] to-[#faf8f5] py-20 border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          {/* Título da seção */}
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary block">
              Nossa Equipe
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-secondary">
              {corretores.length === 1 ? 'Sobre a Corretora' : 'Conheça Nossas Corretoras'}
            </h1>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* Carrossel */}
          <CorretoresCarousel corretores={corretores} />
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

      {/* 3. Banner CTA */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden border border-stone-800 shadow-xl">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Vamos encontrar o seu imóvel ideal juntos?
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed">
              Estamos à disposição para uma consultoria particular, entendendo sua demanda e buscando a propriedade perfeita para você.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <WhatsAppLeadButton
              whatsLink={formatWhatsAppLink(settings.whatsapp)}
              settings={settings}
              corretores={corretores}
              label="Entrar em contato"
              className="w-full sm:w-auto px-8 py-4 rounded-full"
              context={{
                tipo: 'geral',
              }}
            />
            <Link
              href="/contato"
              className="w-full sm:w-auto text-center border border-stone-700 hover:border-stone-500 px-8 py-4 rounded-full font-medium text-sm tracking-wider uppercase transition duration-300"
            >
              Enviar Mensagem
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
