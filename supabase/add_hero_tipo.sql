-- Migration: adicionar coluna hero_tipo na tabela settings
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS hero_tipo text NOT NULL DEFAULT 'padrao'
  CHECK (hero_tipo IN ('padrao', 'wide', 'galeria', 'corretores'));

-- Garantir que o registro id=1 existe com o valor padrão
INSERT INTO settings (id, hero_tipo)
VALUES (1, 'padrao')
ON CONFLICT (id) DO NOTHING;
