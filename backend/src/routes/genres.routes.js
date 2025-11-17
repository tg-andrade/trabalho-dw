const { Router } = require('express');
const genresController = require('../controllers/genres.controller');

const router = Router();

router.get('/', genresController.getGenres);
router.post('/', genresController.createGenre);
router.put('/:id', genresController.updateGenre);
router.delete('/:id', genresController.deleteGenre);

module.exports = router;

