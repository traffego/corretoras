'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  propertyId?: string;
  defaultMessage?: string;
}

export default function ContactForm({ propertyId, defaultMessage = '' }: ContactFormProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !mensagem) {
      setStatus('error');
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          mensagem,
          propertyId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setNome('');
        setEmail('');
        setTelefone('');
        setMensagem(defaultMessage);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro de envio de lead:', err);
      setStatus('error');
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-bold text-secondary">
          Fale Conosco
        </h3>
        <p className="text-sm text-stone-500">
          Preencha os campos abaixo e entraremos em contato o mais breve possível.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-3 flex flex-col items-center animate-in zoom-in duration-300">
          <CheckCircle2 size={40} className="text-emerald-500" />
          <h4 className="font-serif text-lg font-bold text-emerald-950">
            Mensagem enviada!
          </h4>
          <p className="text-sm text-emerald-800 max-w-xs">
            Obrigado pelo contato. Retornaremos o atendimento muito em breve.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs text-emerald-600 underline font-semibold hover:text-emerald-800 transition mt-2 cursor-pointer"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 flex items-start space-x-2.5 text-xs">
              <AlertCircle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nome */}
          <div className="flex flex-col">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* E-mail */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Telefone */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 99999-9999"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Mensagem */}
          <div className="flex flex-col">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
              Mensagem *
            </label>
            <textarea
              required
              rows={4}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Como podemos te ajudar?"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-stone-850 disabled:bg-stone-400 text-white font-medium text-xs tracking-wider uppercase py-4 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
          >
            {loading ? (
              <span>Enviando...</span>
            ) : (
              <>
                <Send size={14} />
                <span>Enviar Mensagem</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
