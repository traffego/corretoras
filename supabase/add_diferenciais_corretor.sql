-- Migration: adicionar coluna diferenciais na tabela corretores
ALTER TABLE corretores
  ADD COLUMN IF NOT EXISTS diferenciais text[] DEFAULT '{}';
