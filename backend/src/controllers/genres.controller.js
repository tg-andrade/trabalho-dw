const genresService = require('../services/genres.service');

const getGenres = (req, res, next) => {
  try {
    const genres = genresService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
};

const createGenre = (req, res, next) => {
  try {
    const genre = genresService.createGenre(req.body);
    res.status(201).json(genre);
  } catch (error) {
    next(error);
  }
};

const updateGenre = (req, res, next) => {
  try {
    const { id } = req.params;
    const genre = genresService.updateGenre(id, req.body);
    res.status(200).json(genre);
  } catch (error) {
    next(error);
  }
};

const deleteGenre = (req, res, next) => {
  try {
    const { id } = req.params;
    genresService.deleteGenre(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre
};

