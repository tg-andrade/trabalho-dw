import { useState } from 'react';
import MovieForm from '../components/MovieForm';
import MovieList from '../components/MovieList';
import GenreFilter from '../components/GenreFilter';
import { useMovies } from '../hooks/useMovies';
import { useGenreContext } from '../context/GenreContext';

const MoviesPage = () => {
  const { genres } = useGenreContext();
  const { movies, loading, error, selectedGenre, setSelectedGenre, fetchMovies, createMovie, updateMovie, deleteMovie } =
    useMovies();
  const [formFeedback, setFormFeedback] = useState('');

  const handleGenreChange = (genreName) => {
    setSelectedGenre(genreName);
    fetchMovies(genreName);
  };

  const handleCreateMovie = async (payload) => {
    try {
      await createMovie(payload);
      setFormFeedback('Conteúdo cadastrado com sucesso!');
      setTimeout(() => setFormFeedback(''), 2500);
    } catch (createError) {
      setFormFeedback(createError.message);
      throw createError;
    }
  };

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1>Filmes e Séries</h1>
          <p>Consome todos os endpoints de filmes com filtro por gênero direto da API.</p>
        </div>
        <GenreFilter
          genres={genres}
          value={selectedGenre}
          onChange={handleGenreChange}
          disabled={loading}
        />
      </header>

      <div className="grid two-columns">
        <MovieForm genres={genres} onSubmit={handleCreateMovie} submitLabel="Cadastrar" />
        <div className="card">
          <h3>Status da API</h3>
          {loading && <p>Carregando filmes...</p>}
          {error && <p className="danger-text">{error}</p>}
          {formFeedback && <p className="success-text">{formFeedback}</p>}
          <p>Total exibido: {movies.length}</p>
          {selectedGenre && <p>Filtro aplicado: {selectedGenre}</p>}
        </div>
      </div>

      <MovieList movies={movies} onDelete={deleteMovie} onUpdate={updateMovie} />
    </section>
  );
};

export default MoviesPage;

