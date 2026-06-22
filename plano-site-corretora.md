# Plano Técnico — Site de Corretora Imobiliária

Referência de estilo: gabrieladimateos.com (hero forte, busca com filtros, carrossel de destaques, ficha técnica completa por imóvel).

---

## 1. Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | **Next.js 14+ (App Router) + TypeScript** | SEO real (cada imóvel indexável), `next/image` resolve a galeria otimizada de graça, Server Components evitam precisar de TanStack Query |
| Estilo | **Tailwind CSS** | rapidez, responsivo nativo |
| Banco/Storage/Auth | **Supabase** | Postgres + bucket de fotos + login do admin, tudo num lugar só |
| Deploy | **Vercel** | integração nativa com Next.js |
| Formulário de contato | **Resend** (ou Supabase Edge Function + serviço de e-mail) | envio automático de lead pro e-mail do corretor |
| Estado/dados no cliente | `fetch` + `useState`/`useEffect` simples | **sem TanStack** — não é necessário aqui, Server Components já resolvem 90% do data-fetching |

---

## 2. Modelagem do banco (Supabase / SQL)

```sql
-- Imóveis
create table properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  codigo text, -- ex: GM0313
  tipo text not null check (tipo in ('casa','sobrado','apartamento','terreno')),
  finalidade text not null check (finalidade in ('venda','aluguel')),
  preco numeric not null,
  bairro text not null,
  condominio text, -- nullable, condomínio fechado específico
  cidade text not null default 'Sinop',
  area_total numeric,
  area_construida numeric,
  quartos int default 0,
  suites int default 0,
  banheiros int default 0,
  vagas int default 0,
  descricao text,
  destaque boolean default false, -- aparece no carrossel da home
  ativo boolean default true,
  created_at timestamptz default now()
);

-- Fotos do imóvel (múltiplas por imóvel)
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  url text not null,
  ordem int default 0
);

-- Leads do formulário de contato
create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  telefone text,
  mensagem text,
  property_id uuid references properties(id), -- null = contato geral
  created_at timestamptz default now()
);

-- RLS: leitura pública de properties/images, escrita só autenticado (admin)
alter table properties enable row level security;
alter table property_images enable row level security;
alter table leads enable row level security;

create policy "Leitura publica imoveis" on properties for select using (ativo = true);
create policy "Leitura publica fotos" on property_images for select using (true);
create policy "Admin gerencia imoveis" on properties for all using (auth.role() = 'authenticated');
create policy "Admin gerencia fotos" on property_images for all using (auth.role() = 'authenticated');
create policy "Insercao publica de leads" on leads for insert with check (true);
create policy "Admin le leads" on leads for select using (auth.role() = 'authenticated');
```

Storage: bucket `property-photos` (público para leitura, escrita autenticada).

---

## 3. Mapa de rotas (App Router)

```
/                       Home premium (hero + busca + carrossel)
/imoveis                Listagem com filtros avançados (tipo, finalidade, bairro/condomínio, preço)
/imoveis/[slug]         Página individual do imóvel (ficha técnica + galeria)
/sobre-mim              Página institucional
/contato                Formulário de contato (ou seção na home)
/admin                  Login (Supabase Auth)
/admin/imoveis          CRUD de imóveis (lista, criar, editar, excluir)
/admin/imoveis/[id]     Form de edição + upload de fotos
```

---

## 4. Componentes principais

- `Header` — logo, menu, vira sticky no scroll
- `Hero` — banner topo + foto + bio curta + CTA "Saiba mais"
- `SearchBar` — tipo, finalidade, bairro/condomínio, faixa de preço → redireciona pra `/imoveis?filtros`
- `PropertyCarousel` — destaques na home (`destaque = true`)
- `PropertyCard` — card reutilizado no carrossel e na listagem (foto, preço, m², quartos)
- `PropertyFilters` — sidebar/topo da página `/imoveis`, usa query params (sem lib extra)
- `PropertyGallery` — grid + lightbox simples, `next/image`
- `FeatureIcons` — quartos/suítes/banheiros/vagas com ícones (lucide-react)
- `AboutSection` — bio, CRECI, autoridade no mercado
- `ContactForm` — nome/email/telefone/mensagem, valida client-side, POST pra API route
- `WhatsAppButton` — flutuante, fixo em todas as páginas, `wa.me/<numero>?text=...`
- `Footer` — contato, categorias de imóveis, redes sociais

---

## 5. Mapeamento feature → implementação

| # | Feature pedida | Como entra |
|---|---|---|
| 1 | Home Premium | `app/page.tsx`: `Hero` + bio resumida |
| 2 | Vitrine Dinâmica | `PropertyCarousel` consumindo `destaque=true` |
| 3 | Busca Inteligente | `SearchBar` na home |
| 4 | Filtros Avançados | tipo + finalidade em `/imoveis` via query params |
| 5 | Mapeamento por Região | filtro de bairro/condomínio (dropdown dinâmico vindo do banco) |
| 6 | Página individual do imóvel | `/imoveis/[slug]` com ficha técnica completa |
| 7 | Galeria otimizada | `PropertyGallery` + `next/image` (lazy load, WebP automático) |
| 8 | Ícones informativos | `FeatureIcons` |
| 9 | Sobre Mim | `/sobre-mim` |
| 10 | Formulário de contato | `ContactForm` + API route + Resend |
| 11 | Botão WhatsApp | `WhatsAppButton` no layout raiz |
| 12 | Responsivo | Tailwind mobile-first em tudo |
| 13 | Banco editável | `/admin` com Supabase Auth + CRUD + seed de 5 imóveis |

---

## 6. Seed inicial

Script `seed.sql` ou rota `scripts/seed.ts` que insere os 5 imóveis modelo com fotos placeholder, pra cliente ver o site funcionando e depois trocar pelos reais no `/admin`.

---

## 7. Deploy

1. Repo no GitHub → import na Vercel
2. Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (só em API routes), `RESEND_API_KEY`
3. Build padrão Next.js, zero config extra

---

## 8. PROMPT FINAL — colar no Claude Code

```
Quero que você construa um site completo para uma corretora de imóveis.

STACK OBRIGATÓRIA:
- Next.js 14+ com App Router, TypeScript
- Tailwind CSS
- Supabase (Postgres + Storage + Auth) como backend
- NÃO use TanStack Query, TanStack Table ou qualquer lib TanStack. Use Server
  Components do Next para data-fetching e useState/useEffect simples nos
  poucos componentes client-side que precisarem de interatividade.
- Projeto precisa rodar na Vercel sem configuração extra.

REFERÊNCIA DE ESTILO: site institucional de uma corretora de alto padrão,
visual elegante, hero forte com foto da corretora, paleta sóbria (tons
terrosos/dourados ou azul-marinho, a definir), tipografia serifada no
título e sans-serif no corpo.

ESTRUTURA DO BANCO (criar essas tabelas no Supabase com SQL):
- properties (slug, titulo, codigo, tipo [casa|sobrado|apartamento|terreno],
  finalidade [venda|aluguel], preco, bairro, condominio, cidade,
  area_total, area_construida, quartos, suites, banheiros, vagas,
  descricao, destaque bool, ativo bool, created_at)
- property_images (property_id, url, ordem)
- leads (nome, email, telefone, mensagem, property_id nullable, created_at)
Configure RLS: leitura pública de properties (ativo=true) e property_images;
escrita só para usuários autenticados; insert público em leads.

PÁGINAS:
1. Home (/) — hero banner com foto + bio curta + CRECI + CTA, barra de
   busca (tipo, finalidade, bairro/condomínio, faixa de preço) que
   redireciona para /imoveis com query params, carrossel de imóveis em
   destaque (destaque=true).
2. /imoveis — listagem com filtros avançados (tipo, finalidade, bairro/
   condomínio, faixa de preço) lidos via searchParams, grid de cards
   responsivo.
3. /imoveis/[slug] — página individual: galeria de fotos otimizada
   (next/image, lightbox simples), ficha técnica completa, ícones de
   quartos/suítes/banheiros/vagas, descrição, botão de WhatsApp
   contextual ("Tenho interesse neste imóvel").
4. /sobre-mim — biografia, foto, CRECI, posicionamento de autoridade.
5. Formulário de contato (seção na home ou /contato) — nome, email,
   telefone, mensagem. Submete para uma API route que salva em `leads`
   no Supabase E envia e-mail via Resend para o e-mail da corretora.
6. Botão flutuante de WhatsApp fixo em todas as páginas (link wa.me com
   número configurável via env var).
7. /admin — login com Supabase Auth (email/senha). Após login:
   /admin/imoveis lista todos os imóveis com ações de editar/excluir/criar;
   formulário de criação/edição com upload de múltiplas fotos para o
   bucket do Supabase Storage, reordenação simples de fotos, toggle de
   "destaque" e "ativo".

COMPONENTES REUTILIZÁVEIS: Header (sticky), Hero, SearchBar, PropertyCard,
PropertyCarousel, PropertyFilters, PropertyGallery, FeatureIcons (usar
lucide-react), AboutSection, ContactForm, WhatsAppButton, Footer.

SEO: metadata dinâmica por imóvel (title, description, og:image usando a
primeira foto), sitemap.xml gerado a partir dos imóveis ativos, robots.txt.

RESPONSIVIDADE: mobile-first, testar especialmente a barra de busca da
home e a galeria de fotos em telas pequenas.

DADOS INICIAIS: criar um script de seed que insere 5 imóveis de exemplo
(tipos variados: casa, sobrado, apartamento, terreno) com 3-4 fotos
placeholder cada, prontos para o cliente substituir pelo /admin.

Comece criando a estrutura do projeto, depois o schema SQL do Supabase,
depois os componentes de UI, depois as páginas, e por último o painel
admin. Vá me mostrando o progresso por etapas.
```

---

## 9. Pontos pra alinhar com o cliente antes de começar

- Paleta de cores e fonte (referência usa tons terrosos/dourados)
- Número de WhatsApp e e-mail de destino dos leads
- Nome do domínio (pra configurar na Vercel)
- Se ele mesmo vai cadastrar os 5 imóveis modelo ou se você cadastra como entrega
