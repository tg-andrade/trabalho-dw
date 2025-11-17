import { apiClient } from '../services/apiClient';

export const fetchGenres = () => apiClient('/genres');

export const createGenre = (payload) =>
  apiClient('/genres', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateGenre = (id, payload) =>
  apiClient(`/genres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

export const deleteGenre = (id) =>
  apiClient(`/genres/${id}`, {
    method: 'DELETE'
  });

