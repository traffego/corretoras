import { getIconeComponente } from '@/components/AtributosImovel';

interface Atributo {
  nome: string;
  icone: string;
  descricao: string;
}

interface FeatureIconsProps {
  atributos?: Atributo[] | null;
  compact?: boolean;
}

export default function FeatureIcons({
  atributos,
  compact = false,
}: FeatureIconsProps) {
  if (!atributos || atributos.length === 0) return null;

  // No modo compacto (cards), limitar a 5 itens para manter o design do card limpo
  const visibleAttrs = compact ? atributos.slice(0, 5) : atributos;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-stone-500 text-[11px] font-medium tracking-wide">
        {visibleAttrs.map((feat, idx) => (
          <div key={idx} className="flex items-center space-x-1">
            <span className="text-primary">{getIconeComponente(feat.icone, 14)}</span>
            <span>
              {/^\d+$/.test(feat.descricao) || feat.descricao.length <= 3
                ? `${feat.descricao} ${feat.nome}`
                : `${feat.nome}: ${feat.descricao}`}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-stone-200/60 my-6">
      {visibleAttrs.map((feat, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <div className="flex items-center justify-center p-3 bg-primary/10 rounded-xl text-primary">
            {getIconeComponente(feat.icone, 18)}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
              {feat.nome}
            </span>
            <span className="text-sm font-semibold text-secondary leading-tight">
              {feat.descricao}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
