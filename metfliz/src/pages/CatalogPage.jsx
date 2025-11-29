import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGenreContext } from '../context/GenreContext';
import { listMovies } from '../services/moviesService';
import { listFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import Notification from '../components/Notification';

const CatalogPage = () => {
  const { genres } = useGenreContext();
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const moviesMap = {};

      try {
        // Carregar filmes (obrigatório)
        const allMovies = await listMovies();
        console.log('Catálogo - Filmes carregados:', allMovies);
        
        // Validar se allMovies é um array
        if (!Array.isArray(allMovies)) {
          throw new Error('Resposta inválida da API. Os filmes devem ser um array.');
        }
        
        // Carregar favoritos (opcional - não quebra se falhar)
        let favoritesData = [];
        try {
          favoritesData = await listFavorites();
          console.log('Catálogo - Favoritos carregados:', favoritesData);
        } catch (favoritesError) {
          console.warn('Aviso: Não foi possível carregar favoritos. Continuando sem favoritos.', favoritesError);
          // Continua sem favoritos - não é crítico
        }
        
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
        
        // Agrupar por gênero
        if (allMovies && allMovies.length > 0) {
          allMovies.forEach((movie) => {
            if (movie && movie.genre) {
              const genreName = movie.genre || 'Sem gênero';
              if (!moviesMap[genreName]) {
                moviesMap[genreName] = [];
              }
              moviesMap[genreName].push(movie);
            }
          });
        }

        console.log('Catálogo - Filmes agrupados:', moviesMap);
        setMoviesByGenre(moviesMap);
      } catch (err) {
        const errorMessage = err.message || 'Erro ao carregar catálogo. Verifique se o backend está rodando.';
        setError(errorMessage);
        console.error('Erro ao carregar catálogo:', err);
        setMoviesByGenre({});
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleFavorite = async (movieId) => {
    console.log('handleToggleFavorite chamado com movieId:', movieId, 'tipo:', typeof movieId);
    const isFavorite = favorites.some((fav) => fav.id === movieId);
    console.log('É favorito?', isFavorite);
    
    try {
      if (isFavorite) {
        console.log('Removendo favorito...');
        await removeFavorite(movieId);
        setFavorites(favorites.filter((fav) => fav.id !== movieId));
        setNotification({ message: 'Removido da sua lista!', type: 'info' });
        console.log('Favorito removido com sucesso');
      } else {
        console.log('Adicionando favorito...');
        const result = await addFavorite(movieId);
        console.log('Resposta do addFavorite:', result);
        
        // Buscar o filme da lista atual de filmes por gênero
        let movie = null;
        for (const genreName in moviesByGenre) {
          movie = moviesByGenre[genreName].find((m) => m.id === movieId);
          if (movie) break;
        }
        
        // Se não encontrou, buscar na API
        if (!movie) {
          console.log('Filme não encontrado na lista local, buscando na API...');
          const allMovies = await listMovies();
          movie = allMovies.find((m) => m.id === movieId);
        }
        
        if (movie) {
          setFavorites([...favorites, movie]);
          setNotification({ message: 'Adicionado à sua lista!', type: 'success' });
          console.log('Filme adicionado à lista de favoritos');
          
          // Recarregar favoritos do servidor após um pequeno delay
          setTimeout(async () => {
            try {
              const updatedFavorites = await listFavorites();
              if (Array.isArray(updatedFavorites)) {
                setFavorites(updatedFavorites);
                console.log('Favoritos recarregados do servidor:', updatedFavorites);
              }
            } catch (err) {
              console.warn('Não foi possível recarregar favoritos do servidor:', err);
            }
          }, 500);
        } else {
          console.warn('Filme não encontrado após adicionar aos favoritos');
          setNotification({ message: 'Favorito adicionado, mas filme não encontrado na lista', type: 'info' });
        }
      }
    } catch (err) {
      console.error('Erro completo ao atualizar favorito:', err);
      console.error('Stack:', err.stack);
      setNotification({ 
        message: `Erro ao ${isFavorite ? 'remover' : 'adicionar'} favorito: ${err.message || 'Erro desconhecido'}`, 
        type: 'error',
        duration: 5000
      });
    }
  };

  const genreNames = Object.keys(moviesByGenre).sort();

  return (
    <section className="page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <header>
        <h1>Catálogo por Categorias</h1>
        <p>Explore nosso catálogo organizado por gênero</p>
      </header>

      {loading ? (
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Carregando catálogo...</p>
        </div>
      ) : error ? (
        <div className="home-error">
          <h2>⚠️ Erro ao carregar catálogo</h2>
          <p className="danger-text">{error}</p>
          <div className="home-error__solutions">
            <h3>Possíveis soluções:</h3>
            <ul>
              <li>Verifique se o backend está rodando em <code>http://localhost:4000</code></li>
              <li>Certifique-se de que o MySQL está rodando e o banco de dados foi criado</li>
              <li>Verifique o console do navegador (F12) para mais detalhes</li>
            </ul>
          </div>
          <button className="primary" onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      ) : genreNames.length === 0 ? (
        <div className="home-empty">
          <h2>📽️ Catálogo Vazio</h2>
          <p>Nenhum filme ou série encontrado no catálogo.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
            Comece adicionando filmes e séries ao catálogo.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="primary" onClick={() => window.location.href = '/movies'}>
              ➕ Adicionar Conteúdo
            </button>
            <button className="secondary" onClick={() => window.location.reload()}>
              🔄 Recarregar
            </button>
          </div>
        </div>
      ) : (
        <div className="catalog-content">
          {genreNames.map((genreName) => {
            const genreMovies = moviesByGenre[genreName] || [];
            return (
              <div key={genreName} className="catalog-section">
                <h2 className="catalog-section__title">{genreName}</h2>
                {genreMovies.length > 0 ? (
                  <div className="catalog-grid">
                    {genreMovies.map((movie) => (
                      <article key={movie.id} className="card movie-card">
                        <Link to={`/movie/${movie.id}`} className="movie-card__link">
                          {movie.coverImage ? (
                            <img src={movie.coverImage} alt={movie.title} className="movie-card__cover" />
                          ) : (
                            <div className="movie-card__cover fallback">Sem imagem</div>
                          )}
                          <div className="movie-card__body">
                            <h4>{movie.title}</h4>
                            <p className="muted">
                              {movie.genre} • {movie.year} • {movie.type}
                            </p>
                            {movie.description && (
                              <p>{movie.description}</p>
                            )}
                          </div>
                        </Link>
                        <footer className="movie-card__actions">
                          <div className="button-group">
                            <button
                              className={favorites.some(f => f.id === movie.id) ? 'primary small' : 'secondary small'}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleToggleFavorite(movie.id);
                              }}
                            >
                              {favorites.some(f => f.id === movie.id) ? '❤️ Remover' : '🤍 Adicionar'}
                            </button>
                          </div>
                        </footer>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted" style={{ padding: '1rem' }}>Nenhum filme neste gênero</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CatalogPage;

