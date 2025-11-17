import { useCallback, useEffect, useState } from 'react';
import * as genresService from '../services/genresService';

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshGenres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await genresService.listGenres();
      setGenres(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar gêneros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshGenres();
  }, [refreshGenres]);

  const createGenre = useCallback(
    async (payload) => {
      await genresService.createGenre(payload);
      await refreshGenres();
    },
    [refreshGenres]
  );

  const updateGenre = useCallback(
    async (id, payload) => {
      await genresService.updateGenre(id, payload);
      await refreshGenres();
    },
    [refreshGenres]
  );

  const deleteGenre = useCallback(
    async (id) => {
      await genresService.deleteGenre(id);
      await refreshGenres();
    },
    [refreshGenres]
  );

  return {
    genres,
    loading,
    error,
    refreshGenres,
    createGenre,
    updateGenre,
    deleteGenre
  };
};

