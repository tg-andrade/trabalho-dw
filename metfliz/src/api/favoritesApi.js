import { apiClient } from '../services/apiClient';

export const fetchFavorites = () => apiClient('/favorites');

export const addFavorite = (movieId) => {
  const movieIdNum = Number(movieId);
  console.log('Adicionando favorito - movieId:', movieId, 'convertido para:', movieIdNum);
  return apiClient('/favorites', {
    method: 'POST',
    body: JSON.stringify({ movieId: movieIdNum })
  });
};

export const removeFavorite = (movieId) =>
  apiClient(`/favorites/${movieId}`, {
    method: 'DELETE'
  });

