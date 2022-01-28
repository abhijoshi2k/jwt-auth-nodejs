// Import installed packages
const router = require('express').Router();

// Import custom modules
const {
	Signup,
	Login,
	RefreshToken,
	Logout
} = require('../controllers/auth.controllers');
const {
	loginPreProcessor,
	verifyRefreshToken,
	verifyAccessToken,
	signupPreProcessor
} = require('../middlewares/auth.middlewares');

// Auth Routes
router.post('/signup', signupPreProcessor, Signup);
router.post('/login', loginPreProcessor, Login);
router.post('/refresh-token', verifyRefreshToken, RefreshToken);
router.post('/logout', verifyAccessToken, Logout);

module.exports = router;
