const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getAllFavorites = async () => {
  return await Favorite.findAll();
};

const addFavorite = async (movieId) => {
  const movieIdNum = Number(movieId);
  
  const movie = await Movie.findById(movieIdNum);
  if (!movie) {
    throw createHttpError(404, 'Filme ou série não encontrado');
  }

  return await Favorite.create(movieIdNum);
};

const removeFavorite = async (movieId) => {
  const movieIdNum = Number(movieId);
  const deleted = await Favorite.delete(movieIdNum);
  
  if (!deleted) {
    throw createHttpError(404, 'Favorito não encontrado');
  }
};

module.exports = {
  getAllFavorites,
  addFavorite,
  removeFavorite
};

