-- Seed Inicial para Banco de Dados — Site de Corretora Imobiliária

-- 1. Limpar tabelas caso já existam dados (evitar duplicatas)
truncate table property_images cascade;
truncate table properties cascade;
truncate table leads cascade;
truncate table settings cascade;

-- 2. Inserir Configurações Iniciais
insert into settings (
  id,
  whatsapp,
  email_destino,
  cor_primaria,
  cor_secundaria,
  nome_corretora,
  creci,
  biografia_curta,
  biografia_longa,
  foto_perfil_url,
  logo_url
) values (
  1,
  '5566999999999', -- WhatsApp exemplo (DDD 66 de Sinop/MT)
  'corretora@exemplo.com',
  '#c5a880', -- Dourado Terroso elegante
  '#1c1917', -- Cinza Pedra escuro
  'Gabriela Mateos',
  'CRECI 12345-F',
  'Especialista em imóveis de alto padrão e condomínios fechados em Sinop e região.',
  'Com mais de 10 anos de atuação especializada no mercado de alto padrão, Gabriela Mateos oferece um serviço de consultoria imobiliária personalizado e sob medida. Focada em identificar as melhores oportunidades em condomínios fechados e áreas nobres, Gabriela acompanha seus clientes em todas as etapas da aquisição, garantindo discrição, segurança jurídica e satisfação total.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', -- Foto de perfil executiva
  null -- Deixado nulo para renderizar o logo como texto estilizado
);

-- 3. Inserir Imóveis
-- Imóvel 1: Sobrado Moderno
insert into properties (id, slug, titulo, codigo, tipo, finalidade, preco, bairro, condominio, cidade, area_total, area_construida, quartos, suites, banheiros, vagas, descricao, destaque, ativo)
values (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'sobrado-moderno-condominio-mondrian',
  'Espetacular Sobrado Moderno',
  'GM001',
  'sobrado',
  'venda',
  2450000.00,
  'Jardim Itália',
  'Condomínio Mondrian',
  'Sinop',
  450,
  380,
  4,
  4,
  6,
  3,
  'Espetacular sobrado de arquitetura moderna e acabamento primoroso em condomínio de alto padrão. O imóvel possui integração total das áreas sociais, living amplo com pé-direito duplo, lareira ecológica e lavabo. A cozinha gourmet está equipada com churrasqueira de alto desempenho e se integra à varanda e à piscina aquecida com cascata. No pavimento superior, encontram-se 4 suítes espaçosas, todas com closet e persianas integradas automatizadas. O condomínio oferece segurança armada 24 horas, academia completa, quadras de tênis e salão de festas.',
  true,
  true
);

-- Imóvel 2: Casa Térrea Minimalista
insert into properties (id, slug, titulo, codigo, tipo, finalidade, preco, bairro, condominio, cidade, area_total, area_construida, quartos, suites, banheiros, vagas, descricao, destaque, ativo)
values (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'casa-terrea-minimalista-florenca',
  'Casa Térrea Minimalista e Contemporânea',
  'GM002',
  'casa',
  'venda',
  1850000.00,
  'Residencial Florença',
  'Condomínio Florença',
  'Sinop',
  360,
  220,
  3,
  3,
  4,
  2,
  'Maravilhosa casa térrea projetada com conceito aberto e volumetria minimalista marcante. Com fachada imponente revestida em pedra natural e ripado de alumínio amadeirado. O living possui teto elevado e integração com a cozinha americana e espaço gourmet. São 3 suítes completas, onde a suíte master possui pia dupla e dois chuveiros no banho. Na área externa, uma deliciosa piscina com hidromassagem e iluminação em LED, rodeada por lindo paisagismo tropical. Garagem coberta para 2 veículos grandes.',
  true,
  true
);

-- Imóvel 3: Apartamento Duplex
insert into properties (id, slug, titulo, codigo, tipo, finalidade, preco, bairro, condominio, cidade, area_total, area_construida, quartos, suites, banheiros, vagas, descricao, destaque, ativo)
values (
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'apartamento-duplex-splendore',
  'Apartamento Duplex Mobiliado de Luxo',
  'GM003',
  'apartamento',
  'venda',
  3200000.00,
  'Setor Comercial',
  'Edifício Splendore',
  'Sinop',
  280,
  280,
  3,
  3,
  5,
  3,
  'Sofisticado apartamento duplex de altíssimo padrão, 100% decorado por escritório de design renomado. Imóvel totalmente climatizado e com automação residencial de som, persianas e iluminação. Primeiro pavimento com amplo living, varanda gourmet envidraçada com churrasqueira e adega climatizada, além de cozinha planejada. Segundo pavimento com 3 suítes, sendo a principal com banheira de imersão e vista deslumbrante da cidade. O condomínio dispõe de piscina de borda infinita, SPA, espaço fitness profissional e portaria blindada.',
  true,
  true
);

-- Imóvel 4: Terreno Plano
insert into properties (id, slug, titulo, codigo, tipo, finalidade, preco, bairro, condominio, cidade, area_total, area_construida, quartos, suites, banheiros, vagas, descricao, destaque, ativo)
values (
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'terreno-plano-bougainville',
  'Terreno Plano em Quadra Nobre',
  'GM004',
  'terreno',
  'venda',
  650000.00,
  'Jardim Bougainville',
  'Condomínio Bougainville',
  'Sinop',
  500,
  0,
  0,
  0,
  0,
  0,
  'Excelente lote residencial totalmente plano com 500m² de área total (15x33,3 metros). Localizado em uma das melhores quadras do renomado condomínio fechado Bougainville, com excelente vizinhança já consolidada de casas de alto padrão. Posição solar privilegiada (sol da manhã). O condomínio oferece uma das maiores áreas verdes da região, pista de caminhada contornando o lago privativo, playground, quadras poliesportivas e portaria inteligente 24h. Pronto para transferência e início imediato de obras.',
  false,
  true
);

-- Imóvel 5: Sobrado Neoclássico
insert into properties (id, slug, titulo, codigo, tipo, finalidade, preco, bairro, condominio, cidade, area_total, area_construida, quartos, suites, banheiros, vagas, descricao, destaque, ativo)
values (
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
  'sobrado-classico-neoclassico-portal-da-mata',
  'Mansão Neoclássica Imponente',
  'GM005',
  'sobrado',
  'venda',
  2900000.00,
  'Jardim das Palmeiras',
  'Condomínio Portal da Mata',
  'Sinop',
  600,
  420,
  4,
  3,
  5,
  4,
  'Magnífico sobrado com arquitetura clássica imponente e acabamento sofisticado. Destaca-se pelo amplo hall de entrada com escada em mármore travertino e corrimão em ferro forjado trabalhado. Dispõe de sala de cinema privativa, escritório planejado e suíte de hóspedes no piso térreo. No pavimento superior, 3 amplas suítes com sacada, closet, sendo a suíte master equipada com banheira de hidromassagem dupla. Área de lazer fantástica contendo piscina com deck de madeira de lei, sauna integrada e amplo quiosque gourmet.',
  false,
  true
);

-- 4. Inserir Imagens dos Imóveis
-- Imóvel 1: Sobrado Moderno (GM001)
insert into property_images (property_id, url, ordem) values
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 1),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 2),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 3),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 4);

-- Imóvel 2: Casa Térrea Minimalista (GM002)
insert into property_images (property_id, url, ordem) values
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 1),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 2),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 3);

-- Imóvel 3: Apartamento Duplex (GM003)
insert into property_images (property_id, url, ordem) values
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 1),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 2),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 3);

-- Imóvel 4: Terreno Plano (GM004)
insert into property_images (property_id, url, ordem) values
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 1),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 2);

-- Imóvel 5: Sobrado Neoclássico (GM005)
insert into property_images (property_id, url, ordem) values
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 1),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80', 2),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', 3);
