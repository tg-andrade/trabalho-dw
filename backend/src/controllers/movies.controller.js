const moviesService = require('../services/movies.service');

const getMovies = (req, res, next) => {
  try {
    const { genre } = req.query;
    const movies = moviesService.getAllMovies(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getMovieById = (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = moviesService.getMovieById(id);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

const createMovie = (req, res, next) => {
  try {
    const movie = moviesService.createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

const updateMovie = (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = moviesService.updateMovie(id, req.body);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

const deleteMovie = (req, res, next) => {
  try {
    const { id } = req.params;
    moviesService.deleteMovie(id);
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

