import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import { searchMovies } from '../services/moviesService';
import { listFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import { listMovies } from '../services/moviesService';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTerm = searchParams.get('q') || '';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await listFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setMovies([]);
    }
  }, [searchTerm]);

  const performSearch = async (term) => {
    if (!term.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(term);
      setMovies(results);
    } catch (err) {
      setError('Erro ao realizar busca');
      console.error(err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchParams({ q: term });
  };

  const handleToggleFavorite = async (movieId) => {
    const isFavorite = favorites.some((fav) => fav.id === movieId);
    
    try {
      if (isFavorite) {
        await removeFavorite(movieId);
        setFavorites(favorites.filter((fav) => fav.id !== movieId));
        console.log('Favorito removido com sucesso');
      } else {
        const result = await addFavorite(movieId);
        console.log('Favorito adicionado:', result);
        
        // Buscar o filme na lista de resultados da busca
        const movie = movies.find((m) => m.id === movieId);
        if (movie) {
          setFavorites([...favorites, movie]);
          console.log('Filme adicionado à lista de favoritos');
        } else {
          // Se não encontrou na busca, buscar na API
          const allMovies = await listMovies();
          const foundMovie = allMovies.find((m) => m.id === movieId);
          if (foundMovie) {
            setFavorites([...favorites, foundMovie]);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
      alert(`Erro ao ${isFavorite ? 'remover' : 'adicionar'} favorito: ${err.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <section className="page">
      <header>
        <h1>Busca</h1>
        <p>Procure por filmes, séries, gêneros ou descrições</p>
      </header>

      <div className="search-container">
        <div className="search-container__wrapper">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {loading && (
        <div className="card">
          <p>Buscando...</p>
        </div>
      )}

      {error && (
        <div className="card">
          <p className="danger-text">{error}</p>
        </div>
      )}

      {!loading && !error && searchTerm && (
        <div className="search-results">
          <h2>
            Resultados para "{searchTerm}" ({movies.length} {movies.length === 1 ? 'resultado' : 'resultados'})
          </h2>
          {movies.length > 0 ? (
            <div className="catalog-grid">
              <MovieList 
                movies={movies} 
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </div>
          ) : (
            <div className="home-empty">
              <p>Nenhum resultado encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="home-empty">
          <p>Digite um termo de busca para começar</p>
        </div>
      )}
    </section>
  );
};

export default SearchPage;

