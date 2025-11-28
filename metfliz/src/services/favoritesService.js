import * as favoritesApi from '../api/favoritesApi';

export const listFavorites = () => favoritesApi.fetchFavorites();
export const addFavorite = (movieId) => favoritesApi.addFavorite(movieId);
export const removeFavorite = (movieId) => favoritesApi.removeFavorite(movieId);

