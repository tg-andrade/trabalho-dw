import { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import { listFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import { listMovies } from '../services/moviesService';

const MyListPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Carregar filmes primeiro
      const moviesData = await listMovies();
      setAllMovies(Array.isArray(moviesData) ? moviesData : []);
      
      // Tentar carregar favoritos (pode falhar se endpoint não existir)
      try {
        const favoritesData = await listFavorites();
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
      } catch (favoritesError) {
        console.warn('Não foi possível carregar favoritos:', favoritesError);
        setFavorites([]);
      }
    } catch (err) {
      setError('Erro ao carregar sua lista');
      console.error(err);
      setFavorites([]);
      setAllMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (movieId) => {
    const isFavorite = favorites.some((fav) => fav.id === movieId);
    
    try {
      if (isFavorite) {
        await removeFavorite(movieId);
        setFavorites(favorites.filter((fav) => fav.id !== movieId));
      } else {
        await addFavorite(movieId);
        const movie = allMovies.find((m) => m.id === movieId);
        if (movie) {
          setFavorites([...favorites, movie]);
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
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

  if (error) {
    return (
      <section className="page">
        <header>
          <h1>Minha Lista</h1>
          <p className="danger-text">{error}</p>
        </header>
      </section>
    );
  }

  return (
    <section className="page">
      <header>
        <h1>Minha Lista</h1>
        <p>Seus títulos favoritos salvos</p>
      </header>

      {loading ? (
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Carregando sua lista...</p>
        </div>
      ) : error ? (
        <div className="card">
          <p className="danger-text">{error}</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="home-empty">
          <p>Sua lista está vazia.</p>
          <p>Adicione filmes e séries favoritos para vê-los aqui!</p>
          <button className="primary" onClick={() => window.location.href = '/'}>
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <>
          <div className="card">
            <h3>Total de títulos salvos: {favorites.length}</h3>
            <p>Gerencie seus favoritos abaixo</p>
          </div>
          <div className="catalog-grid">
            <MovieList movies={favorites} onToggleFavorite={handleToggleFavorite} favorites={favorites} />
          </div>
        </>
      )}
    </section>
  );
};

export default MyListPage;

