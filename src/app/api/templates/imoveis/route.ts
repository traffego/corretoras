import { NextResponse } from 'next/server';

export async function GET() {
  const headers = [
    'titulo',
    'slug',
    'codigo',
    'tipo',
    'finalidade',
    'preco',
    'bairro',
    'condominio',
    'cidade',
    'descricao',
    'destaque',
    'ativo',
    'atributos',
  ];

  const exemplos = [
    [
      'Casa Moderna no Mondrian',
      'casa-moderna-mondrian',
      'IMV-EX01',
      'casa',
      'venda',
      '850000',
      'Mondrian',
      'Condomínio Mondrian',
      'Sinop',
      'Casa com acabamento premium, piso porcelanato e área gourmet completa.',
      'FALSE',
      'TRUE',
      '[{"nome":"Área Total","icone":"ruler","descricao":"400 m²"},{"nome":"Quartos","icone":"bed","descricao":"3"},{"nome":"Suítes","icone":"bed","descricao":"1"},{"nome":"Banheiros","icone":"bath","descricao":"2"},{"nome":"Vagas","icone":"car","descricao":"2"}]',
    ],
    [
      'Sobrado Alto Padrão Buritis',
      'sobrado-alto-padrao-buritis',
      'IMV-EX02',
      'sobrado',
      'venda',
      '1200000',
      'Buritis I',
      '',
      'Sinop',
      'Sobrado com 3 pavimentos, piscina aquecida e churrasqueira gourmet.',
      'TRUE',
      'TRUE',
      '[{"nome":"Área Total","icone":"ruler","descricao":"600 m²"},{"nome":"Quartos","icone":"bed","descricao":"4"},{"nome":"Piscina","icone":"waves","descricao":"Aquecida"},{"nome":"Vagas","icone":"car","descricao":"3"}]',
    ],
    [
      'Terreno Comercial Centro',
      'terreno-comercial-centro',
      'IMV-EX03',
      'terreno',
      'venda',
      '320000',
      'Centro',
      '',
      'Sinop',
      'Terreno plano com ótima localização, próximo ao comércio central.',
      'FALSE',
      'TRUE',
      '[{"nome":"Área Total","icone":"ruler","descricao":"500 m²"}]',
    ],
    [
      'Apartamento Compacto Aluguel',
      'apartamento-compacto-aluguel',
      'IMV-EX04',
      'apartamento',
      'aluguel',
      '2500',
      'Centro',
      'Edifício Solar',
      'Sinop',
      'Apartamento mobiliado com ar-condicionado e internet inclusos.',
      'FALSE',
      'TRUE',
      '[{"nome":"Área","icone":"ruler","descricao":"65 m²"},{"nome":"Quartos","icone":"bed","descricao":"2"},{"nome":"Mobiliado","icone":"sofa","descricao":"Sim"}]',
    ],
  ];

  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;

  const rows = [
    headers.join(','),
    ...exemplos.map(row => row.map(escape).join(',')),
  ];

  // BOM UTF-8 para Excel abrir corretamente
  const bom = '\uFEFF';
  const csv = bom + rows.join('\r\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="importar-imoveis.csv"',
    },
  });
}
