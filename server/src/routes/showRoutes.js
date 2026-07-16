const express = require('express');
const router = express.Router();
const { addShow, getAllShows, getShowById, getShowsByMovie, updateShow, deleteShow } = require('../controllers/showController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOrPartner } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, getAllShows);
router.get('/movie/:movieId', authMiddleware, getShowsByMovie);
router.get('/:id', authMiddleware, getShowById);
router.post('/', authMiddleware, adminOrPartner, addShow);
router.put('/:id', authMiddleware, adminOrPartner, updateShow);
router.delete('/:id', authMiddleware, adminOrPartner, deleteShow);

module.exports = router;