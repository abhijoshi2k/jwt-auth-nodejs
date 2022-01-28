// Import installed packages
const router = require('express').Router();

// Import custom modules
const { Dashboard } = require('../controllers/dashboard.controllers');
const { verifyAccessToken } = require('../middlewares/auth.middlewares');
const { findUser } = require('../middlewares/user.middleware');

// Dashboard Routes
router.get('/', verifyAccessToken, findUser, Dashboard);

module.exports = router;
