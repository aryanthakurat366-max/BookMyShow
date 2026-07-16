const express = require('express');
const router = express.Router();
const { register, login, currentUser, forgotPassword, resetPassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/currentUser', authMiddleware, currentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;