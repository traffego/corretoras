'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Download, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';

interface ImportRow {
  titulo: string;
  slug: string;
  codigo: string;
  tipo: string;
  finalidade: string;
  preco: string;
  bairro: string;
  condominio?: string;
  cidade: string;
  descricao?: string;
  destaque?: string;
  ativo?: string;
  atributos?: string;
}

interface ImportResult {
  linha: number;
  titulo: string;
  status: 'ok' | 'erro';
  mensagem?: string;
}

function parseCSV(text: string): ImportRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h.trim()] = (values[i] || '').trim(); });
    return row as unknown as ImportRow;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export default function ImportarImoveisPage() {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<ImportRow[]>([]);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) { alert('Envie um arquivo .csv'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setPreview(parseCSV(text));
      setResults([]);
      setDone(false);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setImporting(true);
    setResults([]);
    const res: ImportResult[] = [];

    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      const linha = i + 2;
      try {
        let atributos = [];
        if (row.atributos) {
          try { atributos = JSON.parse(row.atributos); } catch { atributos = []; }
        }

        const { error } = await supabase.from('properties').insert({
          titulo: row.titulo,
          slug: row.slug || row.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
          codigo: row.codigo || 'IMV-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          tipo: row.tipo || 'casa',
          finalidade: row.finalidade || 'venda',
          preco: Number(row.preco) || 0,
          bairro: row.bairro || '',
          condominio: row.condominio || null,
          cidade: row.cidade || 'Sinop',
          descricao: row.descricao || null,
          destaque: row.destaque?.toLowerCase() === 'true',
          ativo: row.ativo?.toLowerCase() !== 'false',
          atributos,
        });

        if (error) throw new Error(error.message);
        res.push({ linha, titulo: row.titulo, status: 'ok' });
      } catch (err: any) {
        res.push({ linha, titulo: row.titulo, status: 'erro', mensagem: err.message });
      }
    }

    setResults(res);
    setImporting(false);
    setDone(true);
  };

  const okCount = results.filter(r => r.status === 'ok').length;
  const errCount = results.filter(r => r.status === 'erro').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-stone-200/60 pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary">Importar Imóveis</h1>
          <p className="text-sm text-stone-500 mt-1">Envie um arquivo CSV para cadastrar múltiplos imóveis de uma vez.</p>
        </div>
        <a
          href="/templates/importar-imoveis.csv"
          download
          className="inline-flex items-center space-x-2 bg-white border border-stone-200 hover:border-primary hover:text-primary text-stone-600 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Download size={14} />
          <span>Baixar Template</span>
        </a>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition duration-300 ${dragging ? 'border-primary bg-primary/5' : 'border-stone-200 hover:border-primary hover:bg-stone-50'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
        />
        <Upload size={32} className="mx-auto text-stone-300 mb-4" />
        <p className="font-semibold text-secondary text-sm">Arraste o arquivo CSV ou clique para selecionar</p>
        <p className="text-xs text-stone-400 mt-1">Apenas arquivos <strong>.csv</strong> são aceitos</p>
      </div>

      {/* Preview */}
      {preview.length > 0 && !done && (
        <div className="bg-white border border-stone-200/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-secondary">Pré-visualização</h2>
              <p className="text-xs text-stone-400">{preview.length} imóveis encontrados no arquivo</p>
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="inline-flex items-center space-x-2 bg-primary hover:opacity-90 disabled:bg-stone-400 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              {importing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              <span>{importing ? 'Importando...' : `Importar ${preview.length} imóveis`}</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-[10px] tracking-widest uppercase font-bold text-stone-400 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-5">Código</th>
                  <th className="py-3 px-5">Título</th>
                  <th className="py-3 px-5">Tipo</th>
                  <th className="py-3 px-5">Finalidade</th>
                  <th className="py-3 px-5">Preço</th>
                  <th className="py-3 px-5">Bairro</th>
                  <th className="py-3 px-5">Atributos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="py-3 px-5 font-mono text-xs text-stone-400">{row.codigo}</td>
                    <td className="py-3 px-5 font-semibold text-secondary">{row.titulo}</td>
                    <td className="py-3 px-5 capitalize text-stone-500">{row.tipo}</td>
                    <td className="py-3 px-5 capitalize text-stone-500">{row.finalidade}</td>
                    <td className="py-3 px-5 text-stone-600">
                      {Number(row.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-5 text-stone-500">{row.bairro}</td>
                    <td className="py-3 px-5 text-xs text-stone-400">
                      {row.atributos ? `${(() => { try { return JSON.parse(row.atributos).length; } catch { return 0; } })()} item(s)` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resultados */}
      {done && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {okCount > 0 && (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
                <CheckCircle2 size={16} />
                <span>{okCount} importado(s) com sucesso</span>
              </div>
            )}
            {errCount > 0 && (
              <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
                <XCircle size={16} />
                <span>{errCount} com erro</span>
              </div>
            )}
          </div>

          <div className="bg-white border border-stone-200/50 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-[10px] tracking-widest uppercase font-bold text-stone-400 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-5">Linha</th>
                  <th className="py-3 px-5">Título</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Mensagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {results.map((r, i) => (
                  <tr key={i} className={r.status === 'erro' ? 'bg-rose-50/30' : ''}>
                    <td className="py-3 px-5 font-mono text-xs text-stone-400">{r.linha}</td>
                    <td className="py-3 px-5 font-semibold text-secondary">{r.titulo}</td>
                    <td className="py-3 px-5">
                      {r.status === 'ok'
                        ? <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold"><CheckCircle2 size={14} /><span>OK</span></span>
                        : <span className="inline-flex items-center space-x-1 text-rose-500 font-semibold"><XCircle size={14} /><span>Erro</span></span>
                      }
                    </td>
                    <td className="py-3 px-5 text-xs text-stone-500">{r.mensagem || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {okCount > 0 && (
            <div className="flex items-start space-x-2 text-sm text-stone-500 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Os imóveis importados não possuem fotos. Edite cada um para adicionar imagens antes de publicar.</span>
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-secondary">Instruções do Template</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-600">
          {[
            ['titulo *', 'Nome do imóvel'],
            ['slug', 'URL amigável (gerado auto se vazio)'],
            ['codigo', 'Código exclusivo (gerado auto se vazio)'],
            ['tipo *', 'casa | sobrado | apartamento | terreno'],
            ['finalidade *', 'venda | aluguel'],
            ['preco *', 'Valor numérico sem pontos (ex: 850000)'],
            ['bairro *', 'Nome do bairro'],
            ['condominio', 'Nome do condomínio (opcional)'],
            ['cidade *', 'Cidade (ex: Sinop)'],
            ['descricao', 'Texto livre de descrição'],
            ['destaque', 'TRUE ou FALSE'],
            ['ativo', 'TRUE ou FALSE (padrão: TRUE)'],
            ['atributos', 'JSON no formato do template'],
          ].map(([col, desc]) => (
            <div key={col} className="flex items-start space-x-2">
              <code className="text-[11px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-mono text-primary whitespace-nowrap">{col}</code>
              <span className="text-stone-500 text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
