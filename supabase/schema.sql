-- Esquema de Banco de Dados — Site de Corretora Imobiliária

-- 1. Tabela de Configurações Globais (Tema, Identidade e Contatos)
create table settings (
  id int primary key default 1 check (id = 1),
  whatsapp text,
  email_destino text,
  cor_primaria text default '#c5a880', -- Dourado/terroso padrão (elegante)
  cor_secundaria text default '#1c1917', -- Escuro/pedra padrão
  nome_corretora text default 'Patrícia e Allana (Imóveis Selecionados)',
  creci text default '12345-F',
  biografia_curta text default 'Especialistas em imóveis selecionados de alto padrão em Sinop e região.',
  biografia_longa text default 'Patrícia e Allana são especialistas em intermediação imobiliária de alto padrão, dedicadas a selecionar os melhores imóveis e condomínios fechados. Com foco em atendimento de excelência, transparência e curadoria rigorosa, elas ajudam você a encontrar a propriedade perfeita para seu estilo de vida.',
  foto_perfil_url text, -- Armazenada no storage ou link externo
  logo_url text default '/logo.png', -- Armazenada no storage ou link externo
  updated_at timestamptz default now()
);

-- 2. Tabela de Imóveis
create table properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  codigo text unique not null, -- ex: GM0313
  tipo text not null check (tipo in ('casa','sobrado','apartamento','terreno')),
  finalidade text not null check (finalidade in ('venda','aluguel')),
  preco numeric not null,
  bairro text not null,
  condominio text, -- nulo se não for em condomínio fechado
  cidade text not null default 'Sinop',
  area_total numeric,
  area_construida numeric,
  quartos int default 0,
  suites int default 0,
  banheiros int default 0,
  vagas int default 0,
  descricao text,
  destaque boolean default false, -- se aparece no carrossel da home
  ativo boolean default true,
  created_at timestamptz default now()
);

-- 3. Tabela de Fotos dos Imóveis
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  url text not null,
  ordem int default 0
);

-- 4. Tabela de Leads de Contato
create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  telefone text,
  mensagem text,
  property_id uuid references properties(id) on delete set null, -- nulo se contato geral
  created_at timestamptz default now()
);

-- 5. Habilitar RLS (Row Level Security) em todas as tabelas
alter table settings enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table leads enable row level security;

-- 6. Políticas de RLS para a Tabela settings
create policy "Leitura publica settings" on settings
  for select using (true);

create policy "Admin gerencia settings" on settings
  for all using (auth.role() = 'authenticated');

-- 7. Políticas de RLS para a Tabela properties
create policy "Leitura publica imoveis" on properties
  for select using (ativo = true);

create policy "Admin gerencia imoveis" on properties
  for all using (auth.role() = 'authenticated');

-- 8. Políticas de RLS para a Tabela property_images
create policy "Leitura publica fotos" on property_images
  for select using (true);

create policy "Admin gerencia fotos" on property_images
  for all using (auth.role() = 'authenticated');

-- 9. Políticas de RLS para a Tabela leads
create policy "Insercao publica de leads" on leads
  for insert with check (true);

create policy "Admin gerencia leads" on leads
  for select using (auth.role() = 'authenticated');
