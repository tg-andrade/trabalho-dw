import * as genresApi from '../api/genresApi';

export const listGenres = () => genresApi.fetchGenres();
export const createGenre = (payload) => genresApi.createGenre(payload);
export const updateGenre = (id, payload) => genresApi.updateGenre(id, payload);
export const deleteGenre = (id) => genresApi.deleteGenre(id);

