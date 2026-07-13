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

  // 1. Área - Só adiciona se for maior que 0
  let areaLabel = '';
  let areaTipo = 'Área';
  if (area_construida && area_construida > 0) {
    areaLabel = `${area_construida}m²`;
    areaTipo = 'Construída';
  } else if (area_total && area_total > 0) {
    areaLabel = `${area_total}m²`;
    areaTipo = 'Total';
  }

  if (areaLabel) {
    features.push({
      icon: <Maximize2 size={compact ? 14 : 18} />,
      label: areaLabel,
      subLabel: areaTipo,
    });
  }

  // 2. Quartos / Suítes - Só adiciona se quartos > 0
  if (quartos > 0) {
    features.push({
      icon: <Bed size={compact ? 14 : 18} />,
      label: `${quartos} Quarto${quartos !== 1 ? 's' : ''}`,
      subLabel: suites > 0 ? `${suites} Suíte${suites !== 1 ? 's' : ''}` : 'Quartos',
    });
  }

  // 3. Banheiros - Só adiciona se banheiros > 0
  if (banheiros > 0) {
    features.push({
      icon: <Bath size={compact ? 14 : 18} />,
      label: `${banheiros} Banheiro${banheiros !== 1 ? 's' : ''}`,
      subLabel: 'Banheiros',
    });
  }

  // 4. Vagas - Só adiciona se vagas > 0
  if (vagas > 0) {
    features.push({
      icon: <Car size={compact ? 14 : 18} />,
      label: `${vagas} Vaga${vagas !== 1 ? 's' : ''}`,
      subLabel: 'Garagem',
    });
  }

  if (features.length === 0) return null;

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
              {feat.subLabel}
            </span>
            <span className="text-sm font-semibold text-secondary leading-tight">
              {feat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
