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
	verifyAccessToken
} = require('../middlewares/auth.middlewares');

router.post('/signup', Signup);
router.post('/login', loginPreProcessor, Login);
router.post('/refresh-token', verifyRefreshToken, RefreshToken);
router.post('/logout', verifyAccessToken, Logout);

module.exports = router;
