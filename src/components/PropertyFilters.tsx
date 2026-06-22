'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

interface PropertyFiltersProps {
  bairros: string[];
  condominios: string[];
}

export default function PropertyFilters({ bairros, condominios }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Função utilitária para atualizar os parâmetros na URL
  const updateQueryParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const finalidade = searchParams.get('finalidade') || '';
  const tipo = searchParams.get('tipo') || '';
  const localizacao = searchParams.get('localizacao') || '';
  const precoMin = searchParams.get('precoMin') || '';
  const precoMax = searchParams.get('precoMax') || '';
  const quartos = searchParams.get('quartos') || '';
  const vagas = searchParams.get('vagas') || '';

  const activeFiltersCount = [
    finalidade,
    tipo,
    localizacao,
    precoMin,
    precoMax,
    quartos,
    vagas,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/50 p-6 space-y-6 shadow-sm sticky top-28">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-secondary">
          Filtros de Busca
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline font-semibold flex items-center space-x-1"
          >
            <X size={12} />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Finalidade: Venda / Aluguel */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
          Finalidade
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '', label: 'Todos' },
            { value: 'venda', label: 'Venda' },
            { value: 'aluguel', label: 'Aluguel' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateQueryParam('finalidade', option.value)}
              className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all duration-300 ${
                finalidade === option.value
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-stone-50 text-secondary border-stone-200 hover:bg-stone-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo do Imóvel */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
          Tipo de Imóvel
        </label>
        <select
          value={tipo}
          onChange={(e) => updateQueryParam('tipo', e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-secondary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="">Todos os tipos</option>
          <option value="casa">Casa</option>
          <option value="sobrado">Sobrado</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
        </select>
      </div>

      {/* Região (Bairros e Condomínios) */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
          Localização
        </label>
        <select
          value={localizacao}
          onChange={(e) => updateQueryParam('localizacao', e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-secondary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="">Todas as localizações</option>
          {condominios.length > 0 && (
            <optgroup label="Condomínios">
              {condominios.map((condo) => (
                <option key={condo} value={`condo:${condo}`}>
                  {condo}
                </option>
              ))}
            </optgroup>
          )}
          {bairros.length > 0 && (
            <optgroup label="Bairros">
              {bairros.map((bairro) => (
                <option key={bairro} value={`bairro:${bairro}`}>
                  {bairro}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Faixa de Preço */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
          Faixa de Preço (R$)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={precoMin}
            onChange={(e) => updateQueryParam('precoMin', e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={precoMax}
            onChange={(e) => updateQueryParam('precoMax', e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Quartos Mínimos */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
          Quartos
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {['', '1', '2', '3', '4'].map((num) => (
            <button
              key={num}
              onClick={() => updateQueryParam('quartos', num)}
              className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all duration-300 ${
                quartos === num
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-stone-50 text-secondary border-stone-200 hover:bg-stone-100'
              }`}
            >
              {num === '' ? 'Qualq.' : `${num}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Vagas Mínimas */}
      <div className="space-y-2">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">
          Vagas de Garagem
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {['', '1', '2', '3', '4'].map((num) => (
            <button
              key={num}
              onClick={() => updateQueryParam('vagas', num)}
              className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all duration-300 ${
                vagas === num
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-stone-50 text-secondary border-stone-200 hover:bg-stone-100'
              }`}
            >
              {num === '' ? 'Qualq.' : `${num}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
