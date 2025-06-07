const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validateSignup, validateLogin } = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;