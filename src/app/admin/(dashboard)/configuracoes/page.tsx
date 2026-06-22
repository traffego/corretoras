'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Settings {
  whatsapp: string;
  email_destino: string;
  cor_primaria: string;
  cor_secundaria: string;
  nome_corretora: string;
  creci: string;
  biografia_curta: string;
  biografia_longa: string;
  foto_perfil_url: string;
  logo_url: string;
}

export default function AdminConfiguracoesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [whatsapp, setWhatsapp] = useState('');
  const [emailDestino, setEmailDestino] = useState('');
  const [corPrimaria, setCorPrimaria] = useState('#c5a880');
  const [corSecundaria, setCorSecundaria] = useState('#1c1917');
  const [nomeCorretora, setNomeCorretora] = useState('');
  const [creci, setCreci] = useState('');
  const [biografiaCurta, setBiografiaCurta] = useState('');
  const [biografiaLonga, setBiografiaLonga] = useState('');
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          setErrorMsg('Erro ao carregar configurações: ' + error.message);
        } else if (data) {
          setWhatsapp(data.whatsapp || '');
          setEmailDestino(data.email_destino || '');
          setCorPrimaria(data.cor_primaria || '#c5a880');
          setCorSecundaria(data.cor_secundaria || '#1c1917');
          setNomeCorretora(data.nome_corretora || '');
          setCreci(data.creci || '');
          setBiografiaCurta(data.biografia_curta || '');
          setBiografiaLonga(data.biografia_longa || '');
          setFotoPerfilUrl(data.foto_perfil_url || '');
          setLogoUrl(data.logo_url || '');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Erro ao se conectar ao banco de dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'logo') => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const setUploading = type === 'foto' ? setUploadingFoto : setUploadingLogo;
    const setUrl = type === 'foto' ? setFotoPerfilUrl : setLogoUrl;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      // Upload para o bucket público 'property-photos' (subpasta settings)
      const { error: uploadError } = await supabase.storage
        .from('property-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Falha no upload: ' + uploadError.message);
      }

      // Buscar URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('property-photos')
        .getPublicUrl(filePath);

      setUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp || !emailDestino || !nomeCorretora || !creci) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase
        .from('settings')
        .update({
          whatsapp,
          email_destino: emailDestino,
          cor_primaria: corPrimaria,
          cor_secundaria: corSecundaria,
          nome_corretora: nomeCorretora,
          creci,
          biografia_curta: biografiaCurta,
          biografia_longa: biografiaLonga,
          foto_perfil_url: fotoPerfilUrl || null,
          logo_url: logoUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) {
        throw new Error('Erro ao salvar no banco de dados: ' + error.message);
      }

      setSuccessMsg('Configurações atualizadas com sucesso!');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
            Configurações do Site
          </h1>
          <p className="text-sm text-stone-500">
            Personalize a identidade, tema de cores, contatos e biografia da corretora.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 active:scale-95 disabled:bg-stone-400 text-white font-semibold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl transition duration-300 shadow-md cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Salvar Alterações</span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-100 text-sm flex items-center space-x-2.5">
          <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-sm flex items-center space-x-2.5">
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Lado Esquerdo: Identidade e Contatos */}
        <div className="md:col-span-8 bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Identidade */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-bold text-secondary border-b pb-2 border-stone-100">
              Identidade Profissional
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                  Nome da Corretora *
                </label>
                <input
                  type="text"
                  required
                  value={nomeCorretora}
                  onChange={(e) => setNomeCorretora(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                  Registro CRECI *
                </label>
                <input
                  type="text"
                  required
                  value={creci}
                  onChange={(e) => setCreci(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-serif text-base font-bold text-secondary border-b pb-2 border-stone-100">
              Contatos e Integração
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                  WhatsApp (com DDI e DDD) *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 5566999999999"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                  E-mail Destinatário de Leads *
                </label>
                <input
                  type="email"
                  required
                  value={emailDestino}
                  onChange={(e) => setEmailDestino(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Biografia */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-serif text-base font-bold text-secondary border-b pb-2 border-stone-100">
              Sobre a Corretora
            </h2>
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Biografia Curta (Subtítulo do Hero)
              </label>
              <textarea
                rows={2}
                value={biografiaCurta}
                onChange={(e) => setBiografiaCurta(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Biografia Detalhada (Apresentação Principal)
              </label>
              <textarea
                rows={5}
                value={biografiaLonga}
                onChange={(e) => setBiografiaLonga(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Lado Direito: Cores e Media Uploads */}
        <div className="md:col-span-4 space-y-6">
          {/* Cores do Tema */}
          <div className="bg-white border border-stone-200/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-base font-bold text-secondary border-b pb-2 border-stone-100">
              Tema de Cores
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-secondary">Cor Primária</span>
                <span className="text-[10px] text-stone-400">Destaques, ícones, botões</span>
              </div>
              <input
                type="color"
                value={corPrimaria}
                onChange={(e) => setCorPrimaria(e.target.value)}
                className="h-9 w-9 rounded-lg border border-stone-200 cursor-pointer focus:ring-0"
              />
            </div>
            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-secondary">Cor Secundária</span>
                <span className="text-[10px] text-stone-400">Títulos, fundos de destaque</span>
              </div>
              <input
                type="color"
                value={corSecundaria}
                onChange={(e) => setCorSecundaria(e.target.value)}
                className="h-9 w-9 rounded-lg border border-stone-200 cursor-pointer focus:ring-0"
              />
            </div>
          </div>

          {/* Uploads */}
          <div className="bg-white border border-stone-200/50 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-base font-bold text-secondary border-b pb-2 border-stone-100">
              Arquivos Visuais
            </h2>

            {/* Foto Perfil */}
            <div className="space-y-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                Foto do Perfil
              </span>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-xl border border-stone-200 bg-stone-100 overflow-hidden flex-shrink-0">
                  {fotoPerfilUrl ? (
                    <Image src={fotoPerfilUrl} alt="Perfil" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'foto')}
                    disabled={uploadingFoto}
                    id="foto-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="foto-upload"
                    className="bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs px-3.5 py-2.5 rounded-lg font-semibold tracking-wide cursor-pointer flex items-center justify-center transition duration-300"
                  >
                    {uploadingFoto ? 'Carregando...' : 'Alterar Foto'}
                  </label>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2 border-t border-stone-100 pt-4">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                Logotipo Comercial
              </span>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-12 rounded-xl border border-stone-200 bg-stone-100 overflow-hidden flex-shrink-0">
                  {logoUrl ? (
                    <Image src={logoUrl} alt="Logo" fill className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-[10px] font-semibold text-center leading-none p-1">
                      Texto Estilizado
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    disabled={uploadingLogo}
                    id="logo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs px-3.5 py-2.5 rounded-lg font-semibold tracking-wide cursor-pointer flex items-center justify-center transition duration-300"
                  >
                    {uploadingLogo ? 'Carregando...' : 'Carregar Logo'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
