const Movie = require('../models/Movie');
const { findGenreByName } = require('./genres.service');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateGenreExists = async (genreName) => {
  const normalizedGenre = genreName?.trim();
  if (!normalizedGenre) {
    throw createHttpError(400, 'Gênero é obrigatório');
  }

  const genreExists = await findGenreByName(normalizedGenre);

  if (!genreExists) {
    throw createHttpError(400, 'Gênero informado não está cadastrado');
  }

  return normalizedGenre;
};

const getAllMovies = async (genreFilter) => {
  return await Movie.findAll(genreFilter);
};

const getMovieById = async (id) => {
  const movieId = Number(id);
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw createHttpError(404, 'Filme ou série não encontrado');
  }

  return movie;
};

const createMovie = async (payload) => {
  const { title, genre, year, type, description = '', coverImage = '', videoUrl = '' } = payload || {};

  if (!title || !title.trim()) {
    throw createHttpError(400, 'Título é obrigatório');
  }

  if (!year || Number.isNaN(Number(year))) {
    throw createHttpError(400, 'Ano é obrigatório e deve ser numérico');
  }

  if (!type || !['Filme', 'Série'].includes(type)) {
    throw createHttpError(400, 'Tipo deve ser "Filme" ou "Série"');
  }

  await validateGenreExists(genre);

  return await Movie.create({
    title: title.trim(),
    genre: genre.trim(),
    year: Number(year),
    type,
    description: description.trim(),
    coverImage: coverImage.trim(),
    videoUrl: videoUrl.trim()
  });
};

const updateMovie = async (id, payload) => {
  const movieId = Number(id);
  const existingMovie = await Movie.findById(movieId);

  if (!existingMovie) {
    throw createHttpError(404, 'Filme ou série não encontrado');
  }

  const { title, genre, year, type, description, coverImage, videoUrl } = payload || {};

  if (genre) {
    await validateGenreExists(genre);
  }

  if (year !== undefined && Number.isNaN(Number(year))) {
    throw createHttpError(400, 'Ano deve ser numérico');
  }

  if (type && !['Filme', 'Série'].includes(type)) {
    throw createHttpError(400, 'Tipo deve ser "Filme" ou "Série"');
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (genre !== undefined) updateData.genre = genre;
  if (year !== undefined) updateData.year = Number(year);
  if (type !== undefined) updateData.type = type;
  if (description !== undefined) updateData.description = description;
  if (coverImage !== undefined) updateData.coverImage = coverImage;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

  return await Movie.update(movieId, updateData);
};

const deleteMovie = async (id) => {
  const movieId = Number(id);
  const existingMovie = await Movie.findById(movieId);

  if (!existingMovie) {
    throw createHttpError(404, 'Filme ou série não encontrado');
  }

  const deleted = await Movie.delete(movieId);
  if (!deleted) {
    throw createHttpError(404, 'Filme ou série não encontrado');
  }
};

const searchMovies = async (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    throw createHttpError(400, 'Termo de busca é obrigatório');
  }
  return await Movie.search(searchTerm.trim());
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies
};

