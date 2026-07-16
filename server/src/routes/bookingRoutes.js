const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/my-bookings', authMiddleware, getMyBookings);

module.exports = router;