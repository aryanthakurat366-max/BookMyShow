const express = require('express');
const router = express.Router();
const { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, getAllMovies);
router.get('/:id', authMiddleware, getMovieById);
router.post('/', authMiddleware, adminOnly, addMovie);
router.put('/:id', authMiddleware, adminOnly, updateMovie);
router.delete('/:id', authMiddleware, adminOnly, deleteMovie);

module.exports = router;