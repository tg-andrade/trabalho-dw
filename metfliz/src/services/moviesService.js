import * as moviesApi from '../api/moviesApi';

export const listMovies = (genre) => moviesApi.fetchMovies(genre);
export const findMovie = (id) => moviesApi.fetchMovieById(id);
export const createMovie = (payload) => moviesApi.createMovie(payload);
export const updateMovie = (id, payload) => moviesApi.updateMovie(id, payload);
export const deleteMovie = (id) => moviesApi.deleteMovie(id);

