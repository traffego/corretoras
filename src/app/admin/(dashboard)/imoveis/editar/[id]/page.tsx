import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PropertyForm from '../../PropertyForm';

export const metadata = {
  title: 'Editar Imóvel',
};

interface AdminEditarImovelPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditarImovelPage({ params }: AdminEditarImovelPageProps) {
  const { id } = await params;

  // Buscar dados do imóvel no Supabase (no servidor)
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) {
    notFound();
  }

  // Buscar as imagens do imóvel (no servidor)
  const { data: images } = await supabase
    .from('property_images')
    .select('id, url, ordem')
    .eq('property_id', id)
    .order('ordem', { ascending: true });

  // Mapeia os dados do imóvel e das fotos para os tipos aceitos pelo formulário
  const mappedProperty = {
    id: property.id,
    slug: property.slug,
    titulo: property.titulo,
    codigo: property.codigo,
    tipo: property.tipo,
    finalidade: property.finalidade,
    preco: Number(property.preco),
    bairro: property.bairro,
    condominio: property.condominio,
    cidade: property.cidade,
    area_total: property.area_total,
    area_construida: property.area_construida,
    quartos: property.quartos,
    suites: property.suites,
    banheiros: property.banheiros,
    vagas: property.vagas,
    descricao: property.descricao,
    destaque: property.destaque,
    ativo: property.ativo,
    atributos: Array.isArray(property.atributos) ? property.atributos : [],
  };

  const mappedImages = (images || []).map((img) => ({
    id: img.id,
    url: img.url,
    ordem: img.ordem,
  }));

  return (
    <PropertyForm
      initialProperty={mappedProperty}
      initialImages={mappedImages}
      isEditMode={true}
    />
  );
}
