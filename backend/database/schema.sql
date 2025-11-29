-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS metflix_db;
USE metflix_db;

-- Tabela de gêneros
CREATE TABLE IF NOT EXISTS genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de filmes/séries
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre_id INT NOT NULL,
  year INT NOT NULL,
  type ENUM('Filme', 'Série') NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  video_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de favoritos (Minha Lista)
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (movie_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir gêneros iniciais
INSERT INTO genres (name) VALUES
  ('Ação'),
  ('Drama'),
  ('Comédia'),
  ('Ficção Científica'),
  ('Suspense'),
  ('Romance'),
  ('Animes'),
  ('Documentários'),
  ('Terror'),
  ('Aventura')
ON DUPLICATE KEY UPDATE name=name;

-- Inserir filmes/séries iniciais
INSERT INTO movies (title, genre_id, year, type, description, cover_image) VALUES
  (
    'Inception',
    (SELECT id FROM genres WHERE name = 'Ação' LIMIT 1),
    2010,
    'Filme',
    'Um ladrão entra nos sonhos das pessoas para roubar segredos.',
    'https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg'
  ),
  (
    'Dark',
    (SELECT id FROM genres WHERE name = 'Ficção Científica' LIMIT 1),
    2017,
    'Série',
    'Famílias alemãs enfrentam viagens no tempo e segredos sombrios.',
    'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg'
  )
ON DUPLICATE KEY UPDATE title=title;

