const moviesService = require('../services/movies.service');

const getMovies = async (req, res, next) => {
  try {
    const { genre } = req.query;
    const movies = await moviesService.getAllMovies(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await moviesService.getMovieById(id);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await moviesService.createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await moviesService.updateMovie(id, req.body);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    await moviesService.deleteMovie(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};

