-- Migração: Adicionar coluna video_url na tabela movies
-- Execute este script se você já tem dados no banco e precisa adicionar o campo de vídeo

USE metflix_db;

-- Adicionar coluna video_url se ela não existir
ALTER TABLE movies 
ADD COLUMN IF NOT EXISTS video_url VARCHAR(500) AFTER cover_image;

-- Verificar se a coluna foi adicionada
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'metflix_db' 
  AND TABLE_NAME = 'movies' 
  AND COLUMN_NAME = 'video_url';

