-- Migration: adicionar colunas para marca d'água na tabela settings
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS marca_agua_url text,
  ADD COLUMN IF NOT EXISTS marca_agua_posicao text DEFAULT 'canto-inferior-direito' CHECK (marca_agua_posicao IN ('centro', 'canto-inferior-direito', 'canto-inferior-esquerdo', 'canto-superior-direito', 'canto-superior-esquerdo')),
  ADD COLUMN IF NOT EXISTS marca_agua_opacidade numeric DEFAULT 0.3 CHECK (marca_agua_opacidade >= 0 AND marca_agua_opacidade <= 1),
  ADD COLUMN IF NOT EXISTS marca_agua_tamanho numeric DEFAULT 0.2 CHECK (marca_agua_tamanho >= 0.05 AND marca_agua_tamanho <= 0.9),
  ADD COLUMN IF NOT EXISTS marca_agua_ativa boolean DEFAULT false;

-- Garantir que o registro de ID 1 existe
INSERT INTO settings (id, marca_agua_ativa, marca_agua_posicao, marca_agua_opacidade, marca_agua_tamanho)
VALUES (1, false, 'canto-inferior-direito', 0.3, 0.2)
ON CONFLICT (id) DO NOTHING;
