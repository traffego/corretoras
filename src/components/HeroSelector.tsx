import { SystemSettings } from '@/lib/supabase';
import { Corretor } from './CorretoresCarousel';
import Hero from './Hero';
import HeroWide from './HeroWide';
import HeroGallery from './HeroGallery';
import HeroCorretores from './HeroCorretores';

interface PropertyImage {
  url: string;
  ordem: number;
}

interface Property {
  id: string;
  titulo: string;
  bairro: string;
  preco: number;
  property_images?: PropertyImage[];
}

interface HeroSelectorProps {
  settings: SystemSettings;
  bairros: string[];
  condominios: string[];
  highlightedProperties: Property[];
  corretores: Corretor[];
}

export default function HeroSelector({
  settings,
  bairros,
  condominios,
  highlightedProperties,
  corretores,
}: HeroSelectorProps) {
  const tipo = settings.hero_tipo || 'padrao';

  if (tipo === 'wide') {
    return <HeroWide settings={settings} bairros={bairros} condominios={condominios} />;
  }

  if (tipo === 'galeria') {
    return (
      <HeroGallery
        settings={settings}
        bairros={bairros}
        condominios={condominios}
        highlightedProperties={highlightedProperties}
      />
    );
  }

  if (tipo === 'corretores') {
    return (
      <HeroCorretores
        settings={settings}
        bairros={bairros}
        condominios={condominios}
        corretores={corretores}
      />
    );
  }

  // padrão
  return <Hero settings={settings} bairros={bairros} condominios={condominios} />;
}
