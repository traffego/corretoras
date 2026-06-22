import { Bed, Bath, Car, Maximize2 } from 'lucide-react';

interface FeatureIconsProps {
  quartos?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  area_total?: number | null;
  area_construida?: number | null;
  compact?: boolean;
}

export default function FeatureIcons({
  quartos = 0,
  suites = 0,
  banheiros = 0,
  vagas = 0,
  area_total,
  area_construida,
  compact = false,
}: FeatureIconsProps) {
  const features = [];

  // Adiciona os itens caso tenham valores válidos e maiores que zero
  if (area_construida && area_construida > 0) {
    features.push({
      icon: <Maximize2 size={compact ? 14 : 18} />,
      label: `${area_construida}m² const.`,
    });
  } else if (area_total && area_total > 0) {
    features.push({
      icon: <Maximize2 size={compact ? 14 : 18} />,
      label: `${area_total}m² total`,
    });
  }

  if (quartos > 0) {
    features.push({
      icon: <Bed size={compact ? 14 : 18} />,
      label: `${quartos} quarto${quartos > 1 ? 's' : ''} ${
        suites > 0 ? `(${suites} suíte${suites > 1 ? 's' : ''})` : ''
      }`,
    });
  }

  if (banheiros > 0) {
    features.push({
      icon: <Bath size={compact ? 14 : 18} />,
      label: `${banheiros} banheiro${banheiros > 1 ? 's' : ''}`,
    });
  }

  if (vagas > 0) {
    features.push({
      icon: <Car size={compact ? 14 : 18} />,
      label: `${vagas} vaga${vagas > 1 ? 's' : ''}`,
    });
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-stone-500 text-[11px] font-medium tracking-wide">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center space-x-1">
            <span className="text-primary">{feat.icon}</span>
            <span>{feat.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-stone-200/60 my-6">
      {features.map((feat, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <div className="flex items-center justify-center p-3 bg-primary/10 rounded-xl text-primary">
            {feat.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
              {feat.label.split(' ')[1] || 'Espaço'}
            </span>
            <span className="text-sm font-semibold text-secondary leading-tight">
              {feat.label.split(' ')[0]} {feat.label.includes('suíte') ? 'Suítes' : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
