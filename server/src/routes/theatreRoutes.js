const express = require('express');
const router = express.Router();
const { addTheatre, getTheatres, updateTheatres, deleteTheatres, updateTheatreStatus } = require('../controllers/theatreController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOrPartner, ownerOnly } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, getTheatres);
router.post('/', authMiddleware, adminOrPartner, addTheatre);
router.put('/:id', authMiddleware, adminOrPartner, updateTheatres);
router.delete('/:id', authMiddleware, adminOrPartner, deleteTheatres);
router.patch('/:id/status', authMiddleware, ownerOnly, updateTheatreStatus);

module.exports = router;