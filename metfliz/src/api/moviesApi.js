import { apiClient } from '../services/apiClient';

export const fetchMovies = (genre) => {
  const query = genre ? `?genre=${encodeURIComponent(genre)}` : '';
  return apiClient(`/movies${query}`);
};

export const fetchMovieById = (id) => apiClient(`/movies/${id}`);

export const createMovie = (payload) =>
  apiClient('/movies', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateMovie = (id, payload) =>
  apiClient(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

export const deleteMovie = (id) =>
  apiClient(`/movies/${id}`, {
    method: 'DELETE'
  });

