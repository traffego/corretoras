-- Migration: adicionar coluna whatsapp na tabela corretores
ALTER TABLE corretores
  ADD COLUMN IF NOT EXISTS whatsapp text;
