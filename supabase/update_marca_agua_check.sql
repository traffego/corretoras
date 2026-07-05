-- Migration: atualizar constraint de tamanho máximo da marca d'água para 90% (0.9)
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_marca_agua_tamanho_check;
ALTER TABLE settings ADD CONSTRAINT settings_marca_agua_tamanho_check CHECK (marca_agua_tamanho >= 0.05 AND marca_agua_tamanho <= 0.9);
