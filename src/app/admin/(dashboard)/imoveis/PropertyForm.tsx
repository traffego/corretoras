'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { applyWatermark, type WatermarkSettings } from '@/lib/watermark';
import { ArrowLeft, Save, Trash2, ArrowUp, ArrowDown, Plus, Loader2, Image as ImageIcon, X, ChevronDown, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { ICONES_ATRIBUTO, getIconeComponente, type Atributo } from '@/components/AtributosImovel';

interface PropertyImage {
  id?: string;
  url: string;
  ordem: number;
  file?: File; // Para novos uploads temporários
}

interface Property {
  id?: string;
  slug: string;
  titulo: string;
  codigo: string;
  tipo: string;
  finalidade: string;
  preco: number;
  bairro: string;
  condominio?: string | null;
  cidade: string;
  area_total?: number | null;
  area_construida?: number | null;
  quartos?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  descricao?: string | null;
  destaque?: boolean;
  ativo?: boolean;
  atributos?: Atributo[];
}

interface PropertyFormProps {
  initialProperty?: Property;
  initialImages?: PropertyImage[];
  isEditMode?: boolean;
}

export default function PropertyForm({
  initialProperty,
  initialImages = [],
  isEditMode = false,
}: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [titulo, setTitulo] = useState(initialProperty?.titulo || '');
  const [slug, setSlug] = useState(initialProperty?.slug || '');
  const gerarCodigo = () => 'PA' + Math.floor(1000 + Math.random() * 9000);
  const [codigo, setCodigo] = useState(initialProperty?.codigo || '');
  const [tipo, setTipo] = useState(initialProperty?.tipo || 'casa');
  const [finalidade, setFinalidade] = useState(initialProperty?.finalidade || 'venda');
  const [preco, setPreco] = useState(initialProperty?.preco || 0);
  const [bairro, setBairro] = useState(initialProperty?.bairro || '');
  const [condominio, setCondominio] = useState(initialProperty?.condominio || '');
  const [cidade, setCidade] = useState(initialProperty?.cidade || 'Sinop');
  const [areaTotal, setAreaTotal] = useState(initialProperty?.area_total || 0);
  const [areaConstruida, setAreaConstruida] = useState(initialProperty?.area_construida || 0);
  const [quartos, setQuartos] = useState(initialProperty?.quartos || 0);
  const [suites, setSuites] = useState(initialProperty?.suites || 0);
  const [banheiros, setBanheiros] = useState(initialProperty?.banheiros || 0);
  const [vagas, setVagas] = useState(initialProperty?.vagas || 0);
  const [descricao, setDescricao] = useState(initialProperty?.descricao || '');
  const [destaque, setDestaque] = useState(initialProperty?.destaque || false);
  const [ativo, setAtivo] = useState(initialProperty?.ativo !== false);

  // Atributos customizados
  const [atributos, setAtributos] = useState<Atributo[]>(initialProperty?.atributos || []);
  const [novoAtributo, setNovoAtributo] = useState<Atributo>({ nome: '', icone: 'star', descricao: '' });
  const [iconPickerAberto, setIconPickerAberto] = useState(false);

  // Galeria recolhida no modo edição
  const [galeriaAberta, setGaleriaAberta] = useState(!isEditMode);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Images state
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings | null>(null);

  // Auto-gerar slug a partir do título
  useEffect(() => {
    if (!isEditMode && titulo) {
      const generatedSlug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // remove caract. especiais
        .trim()
        .replace(/\s+/g, '-'); // substitui espaços por -
      setSlug(generatedSlug);
    }
  }, [titulo, isEditMode]);

  // Buscar o próximo código sequencial PA no banco de dados
  useEffect(() => {
    if (!isEditMode && !initialProperty?.codigo) {
      const obterNovoCodigo = async () => {
        try {
          const { data, error } = await supabase
            .from('properties')
            .select('codigo')
            .ilike('codigo', 'PA%')
            .order('codigo', { ascending: false })
            .limit(100); // pegar lista para filtrar de forma robusta no JS

          if (error) throw error;

          let proximoNumero = 1;

          if (data && data.length > 0) {
            // Filtrar apenas códigos que tenham números após o "PA"
            const codigosNumericos = data
              .map(d => {
                const match = d.codigo.match(/PA-?(\d+)/i);
                return match ? parseInt(match[1], 10) : 0;
              })
              .filter(num => num > 0);

            if (codigosNumericos.length > 0) {
              const maxNumero = Math.max(...codigosNumericos);
              proximoNumero = maxNumero + 1;
            }
          }

          // Formatar com 3 dígitos (ex: PA001, PA012, PA123)
          setCodigo(`PA${String(proximoNumero).padStart(3, '0')}`);
        } catch (err) {
          console.error('Erro ao gerar código sequencial:', err);
          // Fallback caso dê algum erro de banco
          const fallbackRand = 'PA' + Math.floor(100 + Math.random() * 900);
          setCodigo(fallbackRand);
        }
      };
      obterNovoCodigo();
    }
  }, [isEditMode, initialProperty]);

  // Carregar configurações de marca d'água
  useEffect(() => {
    const fetchWatermarkSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('marca_agua_url, logo_url, marca_agua_posicao, marca_agua_opacidade, marca_agua_tamanho, marca_agua_ativa')
          .eq('id', 1)
          .single();

        if (!error && data) {
          setWatermarkSettings({
            marca_agua_url: data.marca_agua_url || data.logo_url || null,
            marca_agua_posicao: (data.marca_agua_posicao as any) || 'canto-inferior-direito',
            marca_agua_opacidade: data.marca_agua_opacidade !== null ? Number(data.marca_agua_opacidade) : 0.3,
            marca_agua_tamanho: data.marca_agua_tamanho !== null ? Number(data.marca_agua_tamanho) : 0.2,
            marca_agua_ativa: !!data.marca_agua_ativa,
          });
        }
      } catch (err) {
        console.error('Erro ao buscar configurações de marca d\'água:', err);
      }
    };

    fetchWatermarkSettings();
  }, []);

  // Upload local de fotos para o bucket do Supabase
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImages(true);
    setErrorMsg('');

    const newImages = [...images];
    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        // Aplicar marca d'água se estiver ativa nas configurações
        let fileToUpload = file;
        if (watermarkSettings?.marca_agua_ativa) {
          fileToUpload = await applyWatermark(file, watermarkSettings);
        }

        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        // Fazer upload para o bucket público 'imoveis'
        const { error: uploadError } = await supabase.storage
          .from('imoveis')
          .upload(filePath, fileToUpload);

        if (uploadError) {
          throw new Error('Falha no upload: ' + uploadError.message);
        }

        // Buscar a URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
          .from('imoveis')
          .getPublicUrl(filePath);

        newImages.push({
          url: publicUrl,
          ordem: newImages.length + 1,
        });
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Erro ao subir imagens.');
      }
    }

    setImages(newImages);
    setUploadingImages(false);
    // Limpar o input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    // Reordenar ordens sequencialmente
    const reordered = newImages.map((img, idx) => ({ ...img, ordem: idx + 1 }));
    setImages(reordered);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...images];

    // Swap
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Atualizar index da ordem sequencial
    const updated = reordered.map((img, idx) => ({ ...img, ordem: idx + 1 }));
    setImages(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !slug || !codigo || !bairro || !cidade || preco <= 0) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Adicione pelo menos 1 imagem ao imóvel.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const propertyData = {
        slug,
        titulo,
        codigo,
        tipo,
        finalidade,
        preco: Number(preco),
        bairro,
        condominio: condominio || null,
        cidade,
        area_total: areaTotal ? Number(areaTotal) : null,
        area_construida: areaConstruida ? Number(areaConstruida) : null,
        quartos: Number(quartos),
        suites: Number(suites),
        banheiros: Number(banheiros),
        vagas: Number(vagas),
        descricao: descricao || null,
        destaque,
        ativo,
        atributos: atributos.length > 0 ? atributos : [],
      };

      let propertyId = initialProperty?.id;

      if (isEditMode && propertyId) {
        // Modo Edição: UPDATE
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);

        if (updateError) throw new Error('Erro ao atualizar imóvel: ' + updateError.message);
      } else {
        // Modo Criação: INSERT
        const { data: inserted, error: insertError } = await supabase
          .from('properties')
          .insert([propertyData])
          .select('id')
          .single();

        if (insertError) throw new Error('Erro ao salvar imóvel: ' + insertError.message);
        propertyId = inserted.id;
      }

      // Atualizar imagens do imóvel no banco de dados
      if (propertyId) {
        // 1. Limpar todas as imagens anteriores associadas a este imóvel no banco
        const { error: deleteImagesError } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyId);

        if (deleteImagesError) throw new Error('Erro ao sincronizar imagens antigas.');

        // 2. Inserir imagens atuais atualizadas
        const insertImagesData = images.map((img) => ({
          property_id: propertyId,
          url: img.url,
          ordem: img.ordem,
        }));

        const { error: insertImagesError } = await supabase
          .from('property_images')
          .insert(insertImagesData);

        if (insertImagesError) throw new Error('Erro ao salvar imagens no banco: ' + insertImagesError.message);
      }

      router.push('/admin/imoveis');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao salvar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {/* Header Form */}
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-6">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/imoveis')}
            className="p-2.5 bg-white border border-stone-200 hover:border-stone-300 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-secondary">
              {isEditMode ? `Editar Imóvel (${codigo})` : 'Novo Imóvel'}
            </h1>
            <p className="text-xs text-stone-500">
              {isEditMode ? 'Edite os dados e fotos do imóvel cadastrado.' : 'Preencha a ficha para disponibilizar a listagem.'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 active:scale-95 disabled:bg-stone-400 text-white font-semibold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl transition duration-300 shadow-md cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Salvar Imóvel</span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-100 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bloco de Informações */}
        <div className="lg:col-span-8 bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-secondary border-b pb-3 border-stone-100">
            Ficha Cadastral Geral
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Título */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Título do Imóvel *
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Sobrado Moderno no Mondrian"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Slug (URL Amigável) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex-sobrado-moderno-mondrian"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Código */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Código Exclusivo *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ex: IMV-AB12"
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary font-mono tracking-widest focus:ring-1 focus:ring-primary focus:outline-none"
                />
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setCodigo(gerarCodigo())}
                    className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-[10px] font-bold text-stone-500 uppercase tracking-wider transition cursor-pointer whitespace-nowrap"
                    title="Gerar novo código"
                  >
                    Gerar novo
                  </button>
                )}
              </div>
            </div>

            {/* Tipo */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Tipo do Imóvel *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="casa">Casa</option>
                <option value="sobrado">Sobrado</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>

            {/* Finalidade */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Finalidade *
              </label>
              <select
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            {/* Preço */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Preço de Oferta (R$) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={preco || ''}
                onChange={(e) => setPreco(Number(e.target.value))}
                placeholder="Preço em Reais"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Bairro */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Bairro *
              </label>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Jardim Itália"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Condomínio */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Condomínio Fechado (Opcional)
              </label>
              <input
                type="text"
                value={condominio || ''}
                onChange={(e) => setCondominio(e.target.value)}
                placeholder="Ex: Mondrian Residencial"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Cidade */}
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
                Cidade *
              </label>
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Sinop"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>



          {/* Descrição */}
          <div className="flex flex-col border-t border-stone-100 pt-6">
            <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">
              Descrição Detalhada do Imóvel
            </label>
            <textarea
              rows={6}
              value={descricao || ''}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o imóvel, diferenciais, acabamentos, infraestrutura do condomínio, etc."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-secondary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Sidebar: Status / Destaques / Upload Imagens */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status e Destaque */}
          <div className="bg-white border border-stone-200/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-secondary border-b pb-2.5 border-stone-100">
              Divulgação
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-secondary">Imóvel Ativo</span>
                <span className="text-[10px] text-stone-400 leading-tight">Visível no catálogo público</span>
              </div>
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="h-5 w-5 text-primary focus:ring-primary border-stone-300 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-secondary">Destaque da Home</span>
                <span className="text-[10px] text-stone-400 leading-tight">Aparece no carrossel inicial</span>
              </div>
              <input
                type="checkbox"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
                className="h-5 w-5 text-primary focus:ring-primary border-stone-300 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Upload de Fotos */}
          <div className="bg-white border border-stone-200/50 rounded-2xl shadow-sm overflow-hidden">
            {/* Cabeçalho clicável */}
            <button
              type="button"
              onClick={() => setGaleriaAberta(o => !o)}
              className="w-full flex items-center justify-between p-6 hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <h3 className="font-serif text-base font-bold text-secondary">Fotos do Imóvel *</h3>
                <span className="text-[10px] text-stone-400 font-bold font-mono bg-stone-100 px-2 py-1 rounded-lg">
                  {images.length} FOTO(S)
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-stone-400 transition-transform duration-300 ${galeriaAberta ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Conteúdo recolhível */}
            {galeriaAberta && (
              <div className="px-6 pb-6 space-y-4 border-t border-stone-100">
                {/* Input de File */}
                <div className="relative pt-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImages}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center space-x-2 border-2 border-dashed border-stone-200 hover:border-primary rounded-xl py-6 cursor-pointer hover:bg-stone-50/50 transition duration-300"
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-primary" />
                        <span className="text-xs text-stone-500 font-semibold uppercase">Enviando fotos...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="text-stone-400" />
                        <span className="text-xs text-stone-500 font-semibold uppercase">Adicionar Fotos</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Grid de Fotos com botões na base da miniatura */}
                {images.length > 0 && (
                  <div className="grid grid-cols-1 gap-5 w-[90%] mx-auto">
                    {images.map((img, idx) => (
                      <div
                        key={img.url}
                        className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100"
                        style={{ height: '320px' }}
                      >
                        {/* Imagem */}
                        <Image src={img.url} alt={`Foto ${idx + 1}`} fill className="object-cover" />

                        {/* Badge capa */}
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 text-[9px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase tracking-wide z-10">
                            Capa
                          </span>
                        )}

                        {/* Barra de ações fixa na base */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-1 px-2 py-1.5 bg-black/60 backdrop-blur-sm z-10">
                          <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                            Foto {idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setLightboxIdx(idx)}
                              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                              title="Ver foto ampliada"
                            >
                              <ZoomIn size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/30 text-white disabled:opacity-30 transition cursor-pointer"
                              title="Mover para cima"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'down')}
                              disabled={idx === images.length - 1}
                              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/30 text-white disabled:opacity-30 transition cursor-pointer"
                              title="Mover para baixo"
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition cursor-pointer"
                              title="Remover foto"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lightbox de Zoom */}
          {lightboxIdx !== null && (
            <div
              className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center"
              onClick={() => setLightboxIdx(null)}
            >
              {/* Fechar */}
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer z-10"
              >
                <X size={22} />
              </button>

              {/* Anterior */}
              {lightboxIdx > 0 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i! - 1); }}
                  className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer z-10"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* Imagem */}
              <div
                className="relative max-w-5xl w-full max-h-[85vh] aspect-video mx-8"
                onClick={e => e.stopPropagation()}
              >
                <Image
                  src={images[lightboxIdx].url}
                  alt={`Foto ${lightboxIdx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Próxima */}
              {lightboxIdx < images.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i! + 1); }}
                  className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer z-10"
                >
                  <ChevronRight size={28} />
                </button>
              )}

              {/* Contador */}
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-semibold">
                {lightboxIdx + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bloco de Atributos Customizados */}
      <div className="bg-white border border-stone-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b pb-3 border-stone-100">
          <h2 className="font-serif text-lg font-bold text-secondary">Itens de Destaque</h2>
          <p className="text-xs text-stone-400 mt-1">Adicione atributos importantes com ícone e valor (ex: Vagas → Carro → 3).</p>
        </div>

        {/* Lista dos atributos adicionados */}
        {atributos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {atributos.map((attr, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5 group">
                <button
                  type="button"
                  onClick={() => setAtributos(a => a.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 bg-white border border-stone-200 rounded-lg text-stone-400 hover:text-rose-500 hover:border-rose-200 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
                <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                  {getIconeComponente(attr.icone, 18)}
                </div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 leading-tight">{attr.nome}</span>
                <span className="font-serif text-base font-bold text-secondary">{attr.descricao}</span>
              </div>
            ))}
          </div>
        )}

        {/* Formulário para adicionar novo */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4">
          <p className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">Novo Item</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Nome</label>
              <input
                value={novoAtributo.nome}
                onChange={e => setNovoAtributo(a => ({ ...a, nome: e.target.value }))}
                placeholder="Ex: Vagas"
                className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Valor / Descrição</label>
              <input
                value={novoAtributo.descricao}
                onChange={e => setNovoAtributo(a => ({ ...a, descricao: e.target.value }))}
                placeholder="Ex: 3"
                className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-1.5">Ícone</label>
              {/* Botão que abre o picker */}
              <button
                type="button"
                onClick={() => setIconPickerAberto(o => !o)}
                className="flex items-center space-x-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none hover:border-primary transition cursor-pointer"
              >
                <span className="text-primary">{getIconeComponente(novoAtributo.icone, 16)}</span>
                <span className="text-secondary font-medium flex-1 text-left">
                  {ICONES_ATRIBUTO.find(i => i.key === novoAtributo.icone)?.label || 'Selecionar'}
                </span>
                <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${iconPickerAberto ? 'rotate-180' : ''}`} />
              </button>

              {/* Grid de ícones */}
              {iconPickerAberto && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 grid grid-cols-5 gap-1.5 max-h-60 overflow-y-auto">
                  {ICONES_ATRIBUTO.map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      title={opt.label}
                      onClick={() => {
                        setNovoAtributo(a => ({ ...a, icone: opt.key }));
                        setIconPickerAberto(false);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition gap-1 cursor-pointer ${
                        novoAtributo.icone === opt.key
                          ? 'bg-primary/10 text-primary ring-1 ring-primary'
                          : 'hover:bg-stone-100 text-stone-500 hover:text-secondary'
                      }`}
                    >
                      {opt.icon}
                      <span className="text-[8px] leading-tight text-center font-medium truncate w-full">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview + botão */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                {getIconeComponente(novoAtributo.icone, 18)}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-secondary">{novoAtributo.nome || '—'}</span>
                {novoAtributo.descricao && <span className="text-stone-400 ml-2">{novoAtributo.descricao}</span>}
              </div>
            </div>
            <button
              type="button"
              disabled={!novoAtributo.nome.trim() || !novoAtributo.descricao.trim()}
              onClick={() => {
                if (!novoAtributo.nome.trim() || !novoAtributo.descricao.trim()) return;
                setAtributos(a => [...a, { ...novoAtributo }]);
                setNovoAtributo({ nome: '', icone: 'star', descricao: '' });
              }}
              className="inline-flex items-center space-x-1.5 bg-secondary hover:opacity-90 disabled:bg-stone-300 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
