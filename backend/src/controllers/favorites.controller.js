const favoritesService = require('../services/favorites.service');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await favoritesService.getAllFavorites();
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ error: 'movieId é obrigatório' });
    }
    const favorite = await favoritesService.addFavorite(movieId);
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    await favoritesService.removeFavorite(movieId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};

