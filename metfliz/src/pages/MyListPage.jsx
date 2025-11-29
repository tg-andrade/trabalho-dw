import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import { listMovies } from '../services/moviesService';
import Notification from '../components/Notification';

const MyListPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Tentar carregar favoritos primeiro
      try {
        const favoritesData = await listFavorites();
        console.log('MyListPage - Favoritos carregados da API:', favoritesData);
        console.log('MyListPage - Tipo da resposta:', typeof favoritesData);
        console.log('MyListPage - É array?', Array.isArray(favoritesData));
        
        if (Array.isArray(favoritesData)) {
          setFavorites(favoritesData);
          console.log('MyListPage - Total de favoritos:', favoritesData.length);
          if (favoritesData.length > 0) {
            console.log('MyListPage - Primeiro favorito:', favoritesData[0]);
          }
        } else {
          console.warn('MyListPage - Resposta não é array:', favoritesData);
          setFavorites([]);
        }
      } catch (favoritesError) {
        console.error('MyListPage - Erro ao carregar favoritos:', favoritesError);
        console.error('MyListPage - Mensagem do erro:', favoritesError.message);
        // Se for 404, não é erro crítico - apenas mostra lista vazia
        if (favoritesError.message && (favoritesError.message.includes('404') || favoritesError.message.includes('não encontrado'))) {
          console.warn('Endpoint de favoritos não encontrado (404). Verifique se o backend está rodando e a tabela favorites existe.');
          setFavorites([]);
          setError('Endpoint de favoritos não encontrado. Verifique se o backend está rodando e a tabela favorites existe no banco de dados.');
        } else {
          // Para outros erros, também não quebra, mas mostra aviso
          setFavorites([]);
          setError(`Erro ao carregar favoritos: ${favoritesError.message || 'Erro desconhecido'}`);
        }
      }
      
      // Carregar filmes para referência (opcional)
      try {
        const moviesData = await listMovies();
        setAllMovies(Array.isArray(moviesData) ? moviesData : []);
      } catch (moviesError) {
        console.warn('Não foi possível carregar lista de filmes:', moviesError);
        // Não é crítico para a página de favoritos
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao carregar sua lista';
      setError(errorMessage);
      console.error('MyListPage - Erro geral:', err);
      setFavorites([]);
      setAllMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (movieId) => {
    console.log('MyListPage - Removendo favorito:', movieId);
    try {
      await removeFavorite(movieId);
      setFavorites(favorites.filter((fav) => fav.id !== movieId));
      setNotification({ message: 'Removido da sua lista!', type: 'info' });
      console.log('Favorito removido com sucesso');
      
      // Recarregar lista após remover
      setTimeout(() => {
        loadData();
      }, 500);
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      setNotification({ 
        message: `Erro ao remover favorito: ${err.message || 'Erro desconhecido'}`, 
        type: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <section className="page">
        <header>
          <h1>Minha Lista</h1>
          <p>Carregando...</p>
        </header>
      </section>
    );
  }


  console.log('MyListPage - Favoritos:', favorites);
  console.log('MyListPage - Loading:', loading);
  console.log('MyListPage - Error:', error);

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
        <h1>Minha Lista</h1>
        <p>Seus títulos favoritos salvos</p>
      </header>

      {loading ? (
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Carregando sua lista...</p>
        </div>
      ) : error && error.includes('Endpoint de favoritos não encontrado') ? (
        <div className="home-error">
          <h2>⚠️ Endpoint de Favoritos Não Encontrado</h2>
          <p className="danger-text">{error}</p>
          <div className="home-error__solutions">
            <h3>Possíveis soluções:</h3>
            <ul>
              <li>Verifique se o backend está rodando em <code>http://localhost:4000</code></li>
              <li>Execute o script SQL: <code>backend/database/schema.sql</code> para criar a tabela <code>favorites</code></li>
              <li>Verifique se a rota <code>/api/favorites</code> está registrada no backend</li>
              <li>Reinicie o servidor backend após criar a tabela</li>
            </ul>
          </div>
          <button className="primary" onClick={loadData}>
            Tentar Novamente
          </button>
        </div>
      ) : error ? (
        <div className="home-error">
          <h2>⚠️ Erro ao carregar lista</h2>
          <p className="danger-text">{error}</p>
          <button className="primary" onClick={loadData}>
            Tentar Novamente
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="home-empty">
          <h2>📋 Sua Lista Está Vazia</h2>
          <p>Sua lista está vazia.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
            Adicione filmes e séries favoritos para vê-los aqui!
          </p>
          {error && error.includes('Endpoint de favoritos não encontrado') && (
            <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(255, 107, 107, 0.1)', borderColor: '#ff6b6b', maxWidth: '600px', margin: '1.5rem auto 0' }}>
              <p className="danger-text" style={{ marginBottom: '0.5rem' }}>
                <strong>⚠️ Problema detectado:</strong> O endpoint de favoritos não está disponível.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Isso pode acontecer se a tabela <code>favorites</code> não existir no banco de dados.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Solução:</strong> Execute o script <code>backend/database/schema.sql</code> e reinicie o backend.
              </p>
            </div>
          )}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="primary" onClick={() => window.location.href = '/'}>
              🎬 Explorar Catálogo
            </button>
            <button className="secondary" onClick={loadData}>
              🔄 Recarregar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <h3>Total de títulos salvos: {favorites.length}</h3>
            <p>Gerencie seus favoritos abaixo</p>
          </div>
          <div className="catalog-grid">
            {favorites.map((movie) => (
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
                      className="primary small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(movie.id);
                      }}
                    >
                      ❤️ Remover
                    </button>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default MyListPage;

