import { useCallback, useEffect, useMemo, useState } from 'react';
import * as moviesService from '../services/moviesService';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(
    async (genre = selectedGenre) => {
      setLoading(true);
      setError(null);
      try {
        const data = await moviesService.listMovies(genre);
        setMovies(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar filmes');
      } finally {
        setLoading(false);
      }
    },
    [selectedGenre]
  );

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const createMovie = useCallback(
    async (payload) => {
      await moviesService.createMovie(payload);
      await fetchMovies();
    },
    [fetchMovies]
  );

  const updateMovie = useCallback(
    async (id, payload) => {
      await moviesService.updateMovie(id, payload);
      await fetchMovies();
    },
    [fetchMovies]
  );

  const deleteMovie = useCallback(
    async (id) => {
      await moviesService.deleteMovie(id);
      await fetchMovies();
    },
    [fetchMovies]
  );

  const state = useMemo(
    () => ({
      movies,
      loading,
      error,
      selectedGenre,
      setSelectedGenre
    }),
    [movies, loading, error, selectedGenre]
  );

  const actions = useMemo(
    () => ({
      fetchMovies,
      createMovie,
      updateMovie,
      deleteMovie
    }),
    [fetchMovies, createMovie, updateMovie, deleteMovie]
  );

  return {
    ...state,
    ...actions
  };
};

