import { Phone, Mail, Award, Clock, MapPin } from 'lucide-react';
import { getSettings } from '@/lib/supabase';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contato',
  description: 'Fale conosco e agende seu atendimento personalizado.',
};

export default async function ContatoPage() {
  const settings = await getSettings();

  const formatWhatsAppNumber = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return {
      link: `https://wa.me/${cleanNum}`,
      display: num,
    };
  };

  const whatsappInfo = formatWhatsAppNumber(settings.whatsapp);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Cabeçalho da Página */}
      <div className="border-b border-stone-200/60 pb-8 mb-12 space-y-2 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
          Fale Conosco
        </h1>
        <p className="text-sm text-stone-500">
          Entre em contato pelos canais de atendimento ou nos envie uma mensagem diretamente pelo formulário.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Info de Contato */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-secondary">
              Canais de Atendimento
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Escolha a forma que preferir. Estamos prontos para responder de forma rápida e qualificada.
            </p>
          </div>

          {/* Cards de Contato */}
          <div className="grid grid-cols-1 gap-4">
            {/* WhatsApp */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  WhatsApp
                </span>
                <a
                  href={whatsappInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-secondary hover:text-primary transition"
                >
                  {whatsappInfo.display}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  E-mail
                </span>
                <a
                  href={`mailto:${settings.email_destino}`}
                  className="text-base font-bold text-secondary hover:text-primary transition break-all"
                >
                  {settings.email_destino}
                </a>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  Área de Atendimento
                </span>
                <span className="text-sm font-semibold text-secondary">
                  Sinop/MT, condomínios fechados e região metropolitana.
                </span>
              </div>
            </div>

            {/* Horário */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  Horário de Atendimento
                </span>
                <span className="text-sm font-semibold text-secondary">
                  Segunda a Sexta: 08h às 18h<br />Sábados: 08h às 12h (Plantão)
                </span>
              </div>
            </div>

            {/* CRECI */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/50 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Award size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 block">
                  Registro Profissional
                </span>
                <span className="text-sm font-bold text-secondary">
                  {settings.creci}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
