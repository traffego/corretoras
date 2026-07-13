-- Script para habilitar tipos de imóveis dinâmicos
-- Execute este script no SQL Editor do seu painel do Supabase

-- 1. Remover a restrição de check que limita os tipos de imóveis
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_tipo_check;

-- 2. Criar a tabela de tipos de imóveis
CREATE TABLE IF NOT EXISTS property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Habilitar RLS (Row Level Security) na tabela
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança para a tabela
DROP POLICY IF EXISTS "Leitura publica tipos" ON property_types;
CREATE POLICY "Leitura publica tipos" ON property_types
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gerencia tipos" ON property_types;
CREATE POLICY "Admin gerencia tipos" ON property_types
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. Inserir os tipos padrão
INSERT INTO property_types (name, slug)
VALUES
  ('Casa', 'casa'),
  ('Sobrado', 'sobrado'),
  ('Apartamento', 'apartamento'),
  ('Terreno', 'terreno')
ON CONFLICT (slug) DO NOTHING;
