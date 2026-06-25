import {
  Car, Bed, Bath, Ruler, Trees, Waves, Dumbbell, Wifi,
  ShieldCheck, Zap, Flame, Wind, Sofa, Package, Star,
  Building2, Home, Fence, Sun, PawPrint, Tv, ChefHat,
  Droplets, Plug, Camera, DoorOpen, Warehouse, Mountain,
  SquareParking,
} from 'lucide-react';

export const ICONES_ATRIBUTO: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'car',         label: 'Garagem/Vagas',     icon: <Car size={20} /> },
  { key: 'parking',     label: 'Estacionamento',     icon: <SquareParking size={20} /> },
  { key: 'bed',         label: 'Quartos',            icon: <Bed size={20} /> },
  { key: 'bath',        label: 'Banheiros',          icon: <Bath size={20} /> },
  { key: 'ruler',       label: 'Área',               icon: <Ruler size={20} /> },
  { key: 'trees',       label: 'Área Verde',         icon: <Trees size={20} /> },
  { key: 'waves',       label: 'Piscina',            icon: <Waves size={20} /> },
  { key: 'dumbbell',    label: 'Academia',           icon: <Dumbbell size={20} /> },
  { key: 'wifi',        label: 'Internet',           icon: <Wifi size={20} /> },
  { key: 'shield',      label: 'Segurança',          icon: <ShieldCheck size={20} /> },
  { key: 'zap',         label: 'Energia Solar',      icon: <Zap size={20} /> },
  { key: 'flame',       label: 'Aquecimento',        icon: <Flame size={20} /> },
  { key: 'wind',        label: 'Ar-Condicionado',    icon: <Wind size={20} /> },
  { key: 'sofa',        label: 'Mobiliado',          icon: <Sofa size={20} /> },
  { key: 'package',     label: 'Depósito',           icon: <Package size={20} /> },
  { key: 'star',        label: 'Diferencial',        icon: <Star size={20} /> },
  { key: 'building',    label: 'Condomínio',         icon: <Building2 size={20} /> },
  { key: 'home',        label: 'Casa de Caseiro',    icon: <Home size={20} /> },
  { key: 'fence',       label: 'Murado/Cercado',     icon: <Fence size={20} /> },
  { key: 'sun',         label: 'Varanda/Sacada',     icon: <Sun size={20} /> },
  { key: 'paw',         label: 'Pet Friendly',       icon: <PawPrint size={20} /> },
  { key: 'tv',          label: 'Salão de Festas',    icon: <Tv size={20} /> },
  { key: 'chef',        label: 'Gourmet/Churrasq.',  icon: <ChefHat size={20} /> },
  { key: 'droplets',    label: 'Poço Artesiano',     icon: <Droplets size={20} /> },
  { key: 'plug',        label: 'Infraestrutura',     icon: <Plug size={20} /> },
  { key: 'camera',      label: 'Câmeras',            icon: <Camera size={20} /> },
  { key: 'door',        label: 'Portaria',           icon: <DoorOpen size={20} /> },
  { key: 'warehouse',   label: 'Galpão',             icon: <Warehouse size={20} /> },
  { key: 'mountain',    label: 'Vista Panorâmica',   icon: <Mountain size={20} /> },
];

export interface Atributo {
  nome: string;
  icone: string;
  descricao: string;
}

interface AtributosImovelProps {
  atributos: Atributo[];
}

export function getIconeComponente(key: string, size = 20): React.ReactNode {
  const found = ICONES_ATRIBUTO.find(i => i.key === key);
  if (!found) return <Star size={size} />;
  // Return icon with correct size
  const iconMap: Record<string, React.ReactNode> = {
    car:       <Car size={size} />,
    parking:   <SquareParking size={size} />,
    bed:       <Bed size={size} />,
    bath:      <Bath size={size} />,
    ruler:     <Ruler size={size} />,
    trees:     <Trees size={size} />,
    waves:     <Waves size={size} />,
    dumbbell:  <Dumbbell size={size} />,
    wifi:      <Wifi size={size} />,
    shield:    <ShieldCheck size={size} />,
    zap:       <Zap size={size} />,
    flame:     <Flame size={size} />,
    wind:      <Wind size={size} />,
    sofa:      <Sofa size={size} />,
    package:   <Package size={size} />,
    star:      <Star size={size} />,
    building:  <Building2 size={size} />,
    home:      <Home size={size} />,
    fence:     <Fence size={size} />,
    sun:       <Sun size={size} />,
    paw:       <PawPrint size={size} />,
    tv:        <Tv size={size} />,
    chef:      <ChefHat size={size} />,
    droplets:  <Droplets size={size} />,
    plug:      <Plug size={size} />,
    camera:    <Camera size={size} />,
    door:      <DoorOpen size={size} />,
    warehouse: <Warehouse size={size} />,
    mountain:  <Mountain size={size} />,
  };
  return iconMap[key] ?? <Star size={size} />;
}

export default function AtributosImovel({ atributos }: AtributosImovelProps) {
  if (!atributos || atributos.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-bold text-secondary">Características</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {atributos.map((attr, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white border border-stone-200/60 rounded-2xl p-4 space-y-2 shadow-sm hover:shadow-md hover:border-primary/30 transition duration-300"
          >
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              {getIconeComponente(attr.icone)}
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 leading-tight">
              {attr.nome}
            </span>
            <span className="font-serif text-lg font-bold text-secondary leading-none">
              {attr.descricao}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
