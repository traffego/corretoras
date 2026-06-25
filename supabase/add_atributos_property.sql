-- Migration: adicionar coluna atributos na tabela properties
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS atributos jsonb DEFAULT '[]';
