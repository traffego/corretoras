import { SystemSettings } from '@/lib/supabase';
import Hero from './Hero';
import HeroWide from './HeroWide';
import HeroGallery from './HeroGallery';

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
}

export default function HeroSelector({
  settings,
  bairros,
  condominios,
  highlightedProperties,
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

  // padrão
  return <Hero settings={settings} bairros={bairros} condominios={condominios} />;
}
