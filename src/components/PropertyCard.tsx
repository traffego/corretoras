import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag } from 'lucide-react';
import FeatureIcons from './FeatureIcons';

export interface PropertyImage {
  url: string;
  ordem: number;
}

export interface Property {
  id: string;
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
  property_images?: PropertyImage[];
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Pega a primeira foto com ordem mais baixa ou qualquer uma disponível
  const mainImage =
    property.property_images && property.property_images.length > 0
      ? property.property_images.sort((a, b) => a.ordem - b.ordem)[0].url
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=85'; // Placeholder luxo

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      casa: 'Casa',
      sobrado: 'Sobrado',
      apartamento: 'Apartamento',
      terreno: 'Terreno',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Imagem do Imóvel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={mainImage}
          alt={property.titulo}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Gradiente sobreposto para ler badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 opacity-80" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-primary text-white text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 rounded-full shadow-md">
            {getTipoLabel(property.tipo)}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className="bg-secondary/95 text-white text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1">
            <Tag size={10} className="text-primary" />
            <span>{property.finalidade === 'venda' ? 'Venda' : 'Aluguel'}</span>
          </span>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] text-stone-300 font-mono tracking-wider">
            CÓD: {property.codigo}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Preço */}
          <div className="text-xl font-bold text-secondary font-sans tracking-tight">
            {formatPrice(property.preco)}
          </div>

          {/* Título */}
          <h3 className="font-serif text-lg font-bold text-secondary line-clamp-1 leading-tight group-hover:text-primary transition duration-300">
            {property.titulo}
          </h3>

          {/* Endereço */}
          <div className="flex items-center space-x-1.5 text-xs text-stone-500">
            <MapPin size={14} className="text-primary flex-shrink-0" />
            <span className="line-clamp-1">
              {property.condominio
                ? `${property.condominio}, ${property.bairro}`
                : property.bairro}
            </span>
          </div>
        </div>

        {/* Ícones de Características */}
        <div className="border-t border-stone-100 pt-4">
          <FeatureIcons
            quartos={property.quartos ?? 0}
            suites={property.suites ?? 0}
            banheiros={property.banheiros ?? 0}
            vagas={property.vagas ?? 0}
            area_total={property.area_total}
            area_construida={property.area_construida}
            compact
          />
        </div>

        {/* Link / Ação */}
        <div className="pt-2">
          <Link
            href={`/imoveis/${property.slug}`}
            className="block text-center w-full bg-stone-50 hover:bg-primary hover:text-white text-secondary border border-stone-200/60 hover:border-primary text-xs tracking-wider uppercase font-semibold py-3 rounded-xl transition duration-300"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
