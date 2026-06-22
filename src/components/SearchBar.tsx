'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  bairros: string[];
  condominios: string[];
}

export default function SearchBar({ bairros, condominios }: SearchBarProps) {
  const router = useRouter();
  const [tipo, setTipo] = useState('');
  const [finalidade, setFinalidade] = useState('venda');
  const [localizacao, setLocalizacao] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (finalidade) params.append('finalidade', finalidade);
    if (localizacao) params.append('localizacao', localizacao);
    if (precoMax) params.append('precoMax', precoMax);

    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full glass-dark text-white rounded-2xl md:rounded-full p-4 md:py-3 md:px-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-stone-700/50"
    >
      {/* Finalidade: Venda / Aluguel */}
      <div className="flex flex-col w-full md:w-auto border-b md:border-b-0 md:border-r border-stone-700/60 pb-3 md:pb-0 md:pr-4">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-primary mb-1">
          Finalidade
        </label>
        <select
          value={finalidade}
          onChange={(e) => setFinalidade(e.target.value)}
          className="bg-transparent border-0 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer pr-8 text-stone-200"
        >
          <option value="venda" className="bg-stone-900 text-stone-200">Comprar</option>
          <option value="aluguel" className="bg-stone-900 text-stone-200">Alugar</option>
        </select>
      </div>

      {/* Tipo do Imóvel */}
      <div className="flex flex-col w-full md:w-auto border-b md:border-b-0 md:border-r border-stone-700/60 pb-3 md:pb-0 md:pr-4">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-primary mb-1">
          Tipo
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="bg-transparent border-0 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer pr-8 text-stone-200"
        >
          <option value="" className="bg-stone-900 text-stone-200">Todos os tipos</option>
          <option value="casa" className="bg-stone-900 text-stone-200">Casa</option>
          <option value="sobrado" className="bg-stone-900 text-stone-200">Sobrado</option>
          <option value="apartamento" className="bg-stone-900 text-stone-200">Apartamento</option>
          <option value="terreno" className="bg-stone-900 text-stone-200">Terreno</option>
        </select>
      </div>

      {/* Região (Bairro / Condomínio) */}
      <div className="flex flex-col w-full md:w-auto border-b md:border-b-0 md:border-r border-stone-700/60 pb-3 md:pb-0 md:pr-4 flex-grow">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-primary mb-1">
          Localização
        </label>
        <select
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
          className="bg-transparent border-0 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer pr-8 text-stone-200 w-full"
        >
          <option value="" className="bg-stone-900 text-stone-200">Onde você deseja morar?</option>
          {condominios.length > 0 && (
            <optgroup label="Condomínios" className="bg-stone-900 text-primary">
              {condominios.map((condo) => (
                <option key={condo} value={`condo:${condo}`} className="text-stone-200 bg-stone-900">
                  {condo}
                </option>
              ))}
            </optgroup>
          )}
          {bairros.length > 0 && (
            <optgroup label="Bairros" className="bg-stone-900 text-primary">
              {bairros.map((bairro) => (
                <option key={bairro} value={`bairro:${bairro}`} className="text-stone-200 bg-stone-900">
                  {bairro}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Faixa de Preço Máximo */}
      <div className="flex flex-col w-full md:w-auto pb-3 md:pb-0 md:pr-4">
        <label className="text-[10px] tracking-widest uppercase font-semibold text-primary mb-1">
          Preço Máximo
        </label>
        <select
          value={precoMax}
          onChange={(e) => setPrecoMax(e.target.value)}
          className="bg-transparent border-0 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer pr-8 text-stone-200"
        >
          <option value="" className="bg-stone-900 text-stone-200">Qualquer valor</option>
          <option value="500000" className="bg-stone-900 text-stone-200">Até R$ 500 Mil</option>
          <option value="1000000" className="bg-stone-900 text-stone-200">Até R$ 1.0 Milhão</option>
          <option value="2000000" className="bg-stone-900 text-stone-200">Até R$ 2.0 Milhões</option>
          <option value="3000000" className="bg-stone-900 text-stone-200">Até R$ 3.0 Milhões</option>
          <option value="5000000" className="bg-stone-900 text-stone-200">Até R$ 5.0 Milhões</option>
        </select>
      </div>

      {/* Botão de Busca */}
      <button
        type="submit"
        className="w-full md:w-auto bg-primary text-white p-4 md:p-3.5 rounded-xl md:rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 font-medium text-sm"
      >
        <Search size={16} />
        <span className="md:hidden">Buscar Imóveis</span>
      </button>
    </form>
  );
}
