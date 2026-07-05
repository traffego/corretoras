'use client';

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
  hero_tipo: string;
  marca_agua_url?: string;
  marca_agua_posicao?: 'centro' | 'canto-inferior-direito' | 'canto-inferior-esquerdo' | 'canto-superior-direito' | 'canto-superior-esquerdo';
  marca_agua_opacidade?: number;
  marca_agua_tamanho?: number;
  marca_agua_ativa?: boolean;
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
  const [heroTipo, setHeroTipo] = useState<'padrao' | 'wide' | 'galeria' | 'corretores'>('padrao');
  const [marcaAguaUrl, setMarcaAguaUrl] = useState('');
  const [marcaAguaPosicao, setMarcaAguaPosicao] = useState<'centro' | 'canto-inferior-direito' | 'canto-inferior-esquerdo' | 'canto-superior-direito' | 'canto-superior-esquerdo'>('canto-inferior-direito');
  const [marcaAguaOpacidade, setMarcaAguaOpacidade] = useState(0.3);
  const [marcaAguaTamanho, setMarcaAguaTamanho] = useState(0.2);
  const [marcaAguaAtiva, setMarcaAguaAtiva] = useState(false);

  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMarca, setUploadingMarca] = useState(false);

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
          setLogoUrl(data.logo_url || '/logo.png');
          setHeroTipo((data.hero_tipo as 'padrao' | 'wide' | 'galeria' | 'corretores') || 'padrao');
          setMarcaAguaUrl(data.marca_agua_url || '');
          setMarcaAguaPosicao((data.marca_agua_posicao as 'centro' | 'canto-inferior-direito' | 'canto-inferior-esquerdo' | 'canto-superior-direito' | 'canto-superior-esquerdo') || 'canto-inferior-direito');
          setMarcaAguaOpacidade(data.marca_agua_opacidade !== undefined && data.marca_agua_opacidade !== null ? Number(data.marca_agua_opacidade) : 0.3);
          setMarcaAguaTamanho(data.marca_agua_tamanho !== undefined && data.marca_agua_tamanho !== null ? Number(data.marca_agua_tamanho) : 0.2);
          setMarcaAguaAtiva(!!data.marca_agua_ativa);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'logo' | 'marca') => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const setUploading = type === 'foto' ? setUploadingFoto : type === 'logo' ? setUploadingLogo : setUploadingMarca;
    const setUrl = type === 'foto' ? setFotoPerfilUrl : type === 'logo' ? setLogoUrl : setMarcaAguaUrl;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      // Upload para o bucket público 'imoveis' (subpasta settings)
      const { error: uploadError } = await supabase.storage
        .from('imoveis')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Falha no upload: ' + uploadError.message);
      }

      // Buscar URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('imoveis')
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
        .upsert({
          id: 1,
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
          hero_tipo: heroTipo,
          marca_agua_url: marcaAguaUrl || null,
          marca_agua_posicao: marcaAguaPosicao,
          marca_agua_opacidade: marcaAguaOpacidade,
          marca_agua_tamanho: marcaAguaTamanho,
          marca_agua_ativa: marcaAguaAtiva,
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

            {/* Logo */}
            <div className="space-y-2 border-t border-stone-100 pt-4">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                Logotipo Comercial
              </span>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-12 rounded-xl border border-stone-200 bg-stone-900 overflow-hidden flex-shrink-0">
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
      {/* Seção: Tipo de Hero da Home */}
      <div className="bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b pb-3 border-stone-100">
          <h2 className="font-serif text-base font-bold text-secondary">Estilo do Hero (Capa da Home)</h2>
          <p className="text-xs text-stone-400 mt-1">Escolha o estilo visual da seção principal da página inicial.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            {
              value: 'padrao',
              label: 'Padrão',
              desc: 'Foto da corretora + texto lateral + busca',
              preview: (
                <div className="h-24 rounded-lg bg-gradient-to-r from-[#f5eee6] to-[#faf8f5] flex items-center justify-between px-3 overflow-hidden">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 w-3/4 bg-stone-300 rounded" />
                    <div className="h-3 w-full bg-stone-800 rounded" />
                    <div className="h-2 w-1/2 bg-stone-400 rounded" />
                  </div>
                  <div className="w-12 h-16 bg-stone-300 rounded-t-full rounded-b-lg ml-2 flex-shrink-0" />
                </div>
              ),
            },
            {
              value: 'wide',
              label: 'Wide',
              desc: 'Fundo escuro imersivo + tipografia grande',
              preview: (
                <div className="h-24 rounded-lg bg-gradient-to-br from-stone-900 to-stone-800 flex flex-col items-center justify-center px-3 overflow-hidden">
                  <div className="h-2 w-2/3 bg-[#c5a880] rounded mb-1.5" />
                  <div className="h-4 w-full bg-white/20 rounded mb-1" />
                  <div className="h-2 w-1/2 bg-white/10 rounded" />
                </div>
              ),
            },
            {
              value: 'galeria',
              label: 'Galeria',
              desc: 'Slideshow automático das fotos dos imóveis',
              preview: (
                <div className="h-24 rounded-lg bg-gradient-to-br from-stone-700 to-stone-900 flex flex-col items-end justify-between p-2 overflow-hidden relative">
                  <div className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-40">
                    <div className="bg-stone-500" />
                    <div className="bg-stone-400" />
                    <div className="bg-stone-600" />
                  </div>
                  <div className="relative z-10 flex space-x-1 self-center mt-auto mb-1">
                    <div className="w-4 h-1.5 rounded-full bg-[#c5a880]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                </div>
              ),
            },
            {
              value: 'corretores',
              label: 'Corretoras',
              desc: 'Fotos das corretoras em painéis diagonais',
              preview: (
                <div className="h-24 rounded-lg overflow-hidden relative flex">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-gradient-to-br from-stone-600 to-stone-800" style={{ clipPath: 'polygon(0% 0%, 58% 0%, 42% 100%, 0% 100%)' }} />
                    <div className="flex-1 bg-gradient-to-br from-stone-700 to-stone-900" style={{ clipPath: 'polygon(42% 0%, 100% 0%, 100% 100%, 58% 100%)', marginLeft: '-40%' }} />
                  </div>
                  <div className="relative z-10 flex items-end w-full px-2 pb-2 space-x-4">
                    <div className="space-y-1 flex-1">
                      <div className="h-1.5 w-3/4 bg-[#c5a880] rounded" />
                      <div className="h-2.5 w-full bg-white/60 rounded" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="h-1.5 w-3/4 bg-[#c5a880] rounded" />
                      <div className="h-2.5 w-full bg-white/60 rounded" />
                    </div>
                  </div>
                </div>
              ),
            },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setHeroTipo(opt.value)}
              className={`flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 text-left ${
                heroTipo === opt.value
                  ? 'border-primary shadow-md shadow-primary/10'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {opt.preview}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-secondary">{opt.label}</span>
                  {heroTipo === opt.value && (
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">Ativo</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        </div>
 
      {/* Seção: Configuração da Marca d'Água */}
      <div className="bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b pb-4 border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-base font-bold text-secondary">Marca d'Água Automática</h2>
            <p className="text-xs text-stone-400 mt-1">Aplique marca d'água automaticamente ao fazer upload de novas fotos de imóveis.</p>
          </div>
          <div className="flex items-center space-x-3 bg-stone-50 border border-stone-200/60 rounded-xl px-4 py-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-stone-600">Ativar Recurso</span>
            <button
              type="button"
              onClick={() => setMarcaAguaAtiva(!marcaAguaAtiva)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                marcaAguaAtiva ? 'bg-primary' : 'bg-stone-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  marcaAguaAtiva ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {marcaAguaAtiva && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Coluna 1: Ajustes */}
            <div className="md:col-span-7 space-y-5">
              {/* Upload da Marca */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                  Imagem da Marca d'Água (PNG com transparência recomendado)
                </span>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-12 rounded-xl border border-stone-200 bg-stone-900 overflow-hidden flex-shrink-0">
                    {marcaAguaUrl ? (
                      <img src={marcaAguaUrl} alt="Marca D'água" className="w-full h-full object-contain p-1" />
                    ) : logoUrl ? (
                      <img src={logoUrl} alt="Logo alternativo" className="w-full h-full object-contain p-1 opacity-50" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 text-[10px] font-semibold text-center leading-none p-1">
                        Sem Imagem
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'marca')}
                      disabled={uploadingMarca}
                      id="marca-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="marca-upload"
                      className="bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs px-3.5 py-2.5 rounded-lg font-semibold tracking-wide cursor-pointer flex items-center justify-center transition duration-300"
                    >
                      {uploadingMarca ? 'Carregando...' : 'Carregar Imagem'}
                    </label>
                    <p className="text-[10px] text-stone-400 mt-1">Se não carregar, será usada a logo padrão.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Posição */}
                <div className="flex flex-col">
                  <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                    Posição na Imagem
                  </label>
                  <select
                    value={marcaAguaPosicao}
                    onChange={(e) => setMarcaAguaPosicao(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="centro">Centro</option>
                    <option value="canto-superior-esquerdo">Canto Superior Esquerdo</option>
                    <option value="canto-superior-direito">Canto Superior Direito</option>
                    <option value="canto-inferior-esquerdo">Canto Inferior Esquerdo</option>
                    <option value="canto-inferior-direito">Canto Inferior Direito</option>
                  </select>
                </div>

                {/* Opacidade */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                      Opacidade
                    </label>
                    <span className="text-xs font-semibold text-stone-600">{Math.round(marcaAguaOpacidade * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={marcaAguaOpacidade}
                    onChange={(e) => setMarcaAguaOpacidade(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Tamanho */}
              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                    Tamanho Proporcional (Largura)
                  </label>
                  <span className="text-xs font-semibold text-stone-600">{Math.round(marcaAguaTamanho * 100)}% da largura</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.9"
                  step="0.05"
                  value={marcaAguaTamanho}
                  onChange={(e) => setMarcaAguaTamanho(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-[10px] text-stone-400 mt-1">Determina a largura da marca d'água em relação à foto do imóvel.</span>
              </div>
            </div>

            {/* Coluna 2: Preview Interativo */}
            <div className="md:col-span-5 flex flex-col space-y-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
                Pré-visualização do Resultado
              </span>
              <div className="relative w-full h-52 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-inner flex items-center justify-center">
                {/* Imagem de fundo fictícia do imóvel */}
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"
                  alt="Amostra de Imóvel"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                {/* Marca d'água flutuando por cima */}
                <div
                  className={`absolute transition-all duration-200 select-none pointer-events-none flex items-center justify-center ${
                    marcaAguaPosicao === 'centro'
                      ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                      : marcaAguaPosicao === 'canto-superior-esquerdo'
                      ? 'top-3 left-3'
                      : marcaAguaPosicao === 'canto-superior-direito'
                      ? 'top-3 right-3'
                      : marcaAguaPosicao === 'canto-inferior-esquerdo'
                      ? 'bottom-3 left-3'
                      : 'bottom-3 right-3'
                  }`}
                  style={{
                    opacity: marcaAguaOpacidade,
                    width: `${marcaAguaTamanho * 100}%`,
                    maxWidth: '85%',
                  }}
                >
                  {marcaAguaUrl ? (
                    <img src={marcaAguaUrl} alt="Marca" className="w-full h-auto object-contain max-h-12" />
                  ) : logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-auto object-contain max-h-12" />
                  ) : (
                    <div className="bg-stone-900/80 border border-stone-700 text-stone-200 font-mono font-bold text-[8px] uppercase tracking-widest px-2 py-1 rounded text-center leading-none">
                      Sem Marca
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
