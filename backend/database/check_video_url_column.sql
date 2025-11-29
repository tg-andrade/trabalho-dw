-- Script para verificar se a coluna video_url existe na tabela movies
-- Execute este script no seu banco de dados MySQL

USE metflix_db;

-- Verificar se a coluna existe
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'metflix_db' 
  AND TABLE_NAME = 'movies' 
  AND COLUMN_NAME = 'video_url';

-- Se não retornar nenhuma linha, a coluna não existe
-- Execute o script migration_add_video_url.sql para adicionar a coluna

-- Verificar dados existentes
SELECT id, title, video_url FROM movies LIMIT 10;

