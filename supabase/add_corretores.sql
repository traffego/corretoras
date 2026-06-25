-- Migration: tabela de corretores
CREATE TABLE IF NOT EXISTS corretores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  creci text,
  biografia_curta text,
  biografia_longa text,
  foto_url text,
  especialidade text,
  ordem int DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE corretores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica corretores" ON corretores
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin gerencia corretores" ON corretores
  FOR ALL USING (auth.role() = 'authenticated');
