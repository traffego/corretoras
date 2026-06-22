import { getSettings, supabase } from '@/lib/supabase';
import PropertyCard, { Property } from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';

export const metadata = {
  title: 'Imóveis Exclusivos',
  description: 'Confira nossa listagem completa de casas, sobrados, apartamentos e terrenos de alto padrão.',
};

interface ImoveisPageProps {
  searchParams: Promise<{
    tipo?: string;
    finalidade?: string;
    localizacao?: string;
    precoMin?: string;
    precoMax?: string;
    quartos?: string;
    vagas?: string;
  }>;
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  // A partir do Next 15, searchParams é uma Promise e deve ser resolvida
  const resolvedSearchParams = await searchParams;
  const { tipo, finalidade, localizacao, precoMin, precoMax, quartos, vagas } = resolvedSearchParams;

  // 1. Buscar TODOS os imóveis ativos para popular filtros dinâmicos de localização
  const { data: allActiveProps } = await supabase
    .from('properties')
    .select('bairro, condominio')
    .eq('ativo', true);

  const bairros = Array.from(
    new Set((allActiveProps || []).map((p) => p.bairro).filter(Boolean))
  ) as string[];

  const condominios = Array.from(
    new Set((allActiveProps || []).map((p) => p.condominio).filter(Boolean))
  ) as string[];

  // 2. Construir a query filtrada de imóveis
  let query = supabase
    .from('properties')
    .select('*, property_images(url, ordem)')
    .eq('ativo', true);

  if (tipo) {
    query = query.eq('tipo', tipo);
  }
  if (finalidade) {
    query = query.eq('finalidade', finalidade);
  }
  if (localizacao) {
    if (localizacao.startsWith('condo:')) {
      query = query.eq('condominio', localizacao.substring(6));
    } else if (localizacao.startsWith('bairro:')) {
      query = query.eq('bairro', localizacao.substring(7));
    }
  }
  if (precoMin) {
    query = query.gte('preco', Number(precoMin));
  }
  if (precoMax) {
    query = query.lte('preco', Number(precoMax));
  }
  if (quartos) {
    query = query.gte('quartos', Number(quartos));
  }
  if (vagas) {
    query = query.gte('vagas', Number(vagas));
  }

  // Ordenar por data de cadastro decrescente
  query = query.order('created_at', { ascending: false });

  const { data: filteredProperties, error } = await query;
  const properties: Property[] = filteredProperties || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Cabeçalho da Página */}
      <div className="border-b border-stone-200/60 pb-8 mb-10 space-y-2 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary">
          Catálogo de Imóveis
        </h1>
        <p className="text-sm text-stone-500">
          Explore nossa seleção rigorosa de imóveis de alto padrão e condomínios de luxo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Filtros Lateral */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <PropertyFilters bairros={bairros} condominios={condominios} />
        </aside>

        {/* Listagem */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 tracking-wider font-semibold uppercase">
            <span>Resultados encontrados: {properties.length}</span>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-800 p-6 rounded-2xl border border-rose-100 text-sm">
              Erro ao carregar imóveis: {error.message}
            </div>
          )}

          {properties.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-16 text-center space-y-4">
              <h3 className="font-serif text-xl font-bold text-secondary">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
                Tente ajustar os critérios dos filtros ao lado ou clique para ver todo o catálogo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
