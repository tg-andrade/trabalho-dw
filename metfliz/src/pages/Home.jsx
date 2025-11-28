import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenreContext } from '../context/GenreContext';
import { listMovies } from '../services/moviesService';
import { listFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import { searchMovies } from '../services/moviesService';
import SearchBar from '../components/SearchBar';
import MovieCarousel from '../components/MovieCarousel';
import Notification from '../components/Notification';

const Home = () => {
  const navigate = useNavigate();
  const { genres } = useGenreContext();
  const [movies, setMovies] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Carregar filmes (obrigatório)
      const allMovies = await listMovies();
      console.log('Filmes carregados:', allMovies);
      
      // Verificar se allMovies é um array válido
      if (!Array.isArray(allMovies)) {
        throw new Error('Resposta inválida da API. Verifique se o backend está rodando.');
      }
      
      setMovies(allMovies);
      
      // Carregar favoritos (opcional - não quebra se falhar)
      let favoritesData = [];
      try {
        favoritesData = await listFavorites();
        console.log('Favoritos carregados:', favoritesData);
      } catch (favoritesError) {
        console.warn('Aviso: Não foi possível carregar favoritos. Continuando sem favoritos.', favoritesError);
        // Continua sem favoritos - não é crítico
      }
      
      setFavorites(Array.isArray(favoritesData) ? favoritesData : []);

      // Selecionar filme em destaque (primeiro com imagem)
      const featured = allMovies.length > 0 
        ? (allMovies.find(m => m.coverImage) || allMovies[0])
        : null;
      setFeaturedMovie(featured);

      // Agrupar por gênero
      const moviesMap = {};
      if (allMovies && allMovies.length > 0) {
        allMovies.forEach((movie) => {
          const genreName = movie.genre || 'Sem gênero';
          if (!moviesMap[genreName]) {
            moviesMap[genreName] = [];
          }
          moviesMap[genreName].push(movie);
        });
      }

      console.log('Filmes agrupados por gênero:', moviesMap);
      setMoviesByGenre(moviesMap);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      const errorMessage = err.message || 'Erro ao conectar com o servidor';
      setError(errorMessage);
      setMovies([]);
      setMoviesByGenre({});
      setFeaturedMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    setShowSearch(true);
    try {
      const results = await searchMovies(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error('Erro na busca:', err);
      setSearchResults([]);
    }
  };

  const handleToggleFavorite = async (movieId) => {
    const isFavorite = favorites.some((fav) => fav.id === movieId);

    try {
      if (isFavorite) {
        await removeFavorite(movieId);
        setFavorites(favorites.filter((fav) => fav.id !== movieId));
        setNotification({ message: 'Removido da sua lista!', type: 'info' });
        console.log('Favorito removido com sucesso');
      } else {
        const result = await addFavorite(movieId);
        console.log('Favorito adicionado:', result);
        
        // Buscar o filme na lista atual
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          setFavorites([...favorites, movie]);
          setNotification({ message: 'Adicionado à sua lista!', type: 'success' });
          console.log('Filme adicionado à lista de favoritos');
        } else {
          console.warn('Filme não encontrado após adicionar aos favoritos');
          setNotification({ message: 'Favorito adicionado, mas filme não encontrado na lista', type: 'info' });
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
      setNotification({ 
        message: `Erro ao ${isFavorite ? 'remover' : 'adicionar'} favorito: ${err.message || 'Erro desconhecido'}`, 
        type: 'error' 
      });
    }
  };

  const handleMovieClick = (movie) => {
    // Pode navegar para detalhes ou fazer outra ação
    console.log('Filme clicado:', movie);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Carregando catálogo...</p>
      </div>
    );
  }

  const genreNames = Object.keys(moviesByGenre).sort();
  const hasMovies = movies.length > 0;

  // Mostrar erro de conexão
  if (error) {
    return (
      <div className="home-page">
        <div className="home-error">
          <h2>⚠️ Erro ao carregar dados</h2>
          <p className="danger-text">{error}</p>
          <div className="home-error__solutions">
            <h3>Possíveis soluções:</h3>
            <ul>
              <li>Verifique se o backend está rodando em <code>http://localhost:4000</code></li>
              <li>Certifique-se de que o MySQL está rodando e o banco de dados foi criado</li>
              <li>Verifique o console do navegador (F12) para mais detalhes</li>
            </ul>
          </div>
          <button className="primary" onClick={loadData}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Hero Banner */}
      {hasMovies && featuredMovie && (
        <div className="hero-banner">
          <div
            className="hero-banner__background"
            style={{
              backgroundImage: featuredMovie.coverImage
                ? `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${featuredMovie.coverImage})`
                : 'linear-gradient(to bottom, rgba(229,9,20,0.8), rgba(0,0,0,0.9))'
            }}
          >
            <div className="hero-banner__content">
              <div className="hero-banner__info">
                <h1 className="hero-banner__title">{featuredMovie.title}</h1>
                <div className="hero-banner__meta">
                  <span>{featuredMovie.year}</span>
                  <span>•</span>
                  <span>{featuredMovie.type}</span>
                  <span>•</span>
                  <span>{featuredMovie.genre}</span>
                </div>
                {featuredMovie.description && (
                  <p className="hero-banner__description">{featuredMovie.description}</p>
                )}
                <div className="hero-banner__actions">
                  <button
                    className="primary large"
                    onClick={() => handleMovieClick(featuredMovie)}
                  >
                    ▶ Assistir
                  </button>
                  <button
                    className={`secondary large ${favorites.some(f => f.id === featuredMovie.id) ? 'active' : ''}`}
                    onClick={() => handleToggleFavorite(featuredMovie.id)}
                  >
                    {favorites.some(f => f.id === featuredMovie.id) ? '❤️ Minha Lista' : '🤍 Minha Lista'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Busca */}
      <div className="home-search">
        <div className="home-search__container">
          <SearchBar onSearch={handleSearch} placeholder="Buscar filmes, séries, gêneros..." />
        </div>
      </div>

      {/* Resultados da Busca */}
      {showSearch && (
        <div className="home-search-results">
          <div className="home-search-results__header">
            <h2>Resultados da Busca ({searchResults.length})</h2>
            <button className="secondary small" onClick={() => {
              setShowSearch(false);
              setSearchResults([]);
            }}>
              Fechar
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div className="home-search-results__grid">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="home-search-results__item"
                  onClick={() => handleMovieClick(movie)}
                >
                  {movie.coverImage ? (
                    <img src={movie.coverImage} alt={movie.title} />
                  ) : (
                    <div className="home-search-results__fallback">Sem imagem</div>
                  )}
                  <div className="home-search-results__info">
                    <h3>{movie.title}</h3>
                    <p>{movie.year} • {movie.type} • {movie.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="home-search-results__empty">Nenhum resultado encontrado</p>
          )}
        </div>
      )}

      {/* Carrosséis por Gênero */}
      {!showSearch && (
        <div className="home-content">
          {hasMovies && genreNames.length > 0 ? (
            genreNames.map((genreName) => (
              <MovieCarousel
                key={genreName}
                title={genreName}
                movies={moviesByGenre[genreName] || []}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            ))
          ) : (
            <div className="home-empty">
              <h2>📽️ Catálogo Vazio</h2>
              <p>Nenhum filme ou série encontrado no catálogo.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                Comece adicionando filmes e séries ao catálogo.
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="primary" onClick={() => navigate('/movies')}>
                  ➕ Adicionar Conteúdo
                </button>
                <button className="secondary" onClick={loadData}>
                  🔄 Recarregar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
