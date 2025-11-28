const genresService = require('../services/genres.service');

const getGenres = async (req, res, next) => {
  try {
    const genres = await genresService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
};

const createGenre = async (req, res, next) => {
  try {
    const genre = await genresService.createGenre(req.body);
    res.status(201).json(genre);
  } catch (error) {
    next(error);
  }
};

const updateGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const genre = await genresService.updateGenre(id, req.body);
    res.status(200).json(genre);
  } catch (error) {
    next(error);
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    await genresService.deleteGenre(id);
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

