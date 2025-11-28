const { Router } = require('express');
const favoritesController = require('../controllers/favorites.controller');

const router = Router();

router.get('/', favoritesController.getFavorites);
router.post('/', favoritesController.addFavorite);
router.delete('/:movieId', favoritesController.removeFavorite);

module.exports = router;

