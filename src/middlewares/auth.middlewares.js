// Import installed packages
const jwt = require('jsonwebtoken');

// Import custom modules
const User = require('../models/User');
const { getKey } = require('../connections/redis.connection');

// Login PreProcessor
const loginPreProcessor = async (req, res, next) => {
	// Check if username and password are present and not empty
	if (
		!req.body.username ||
		!req.body.password ||
		req.body.username.trim() === '' ||
		req.body.password.trim() === ''
	) {
		return res
			.status(400)
			.json({ message: 'Please enter username and password' });
	}

	// Check if username and password are valid
	let user = await User.findOne({
		username: req.body.username,
		password: req.body.password
	}).exec();

	// If user is not found, return 401 (unauthorized) status
	if (!user) {
		return res.status(401).json({ message: 'Invalid Credentials' });
	}

	// Store user in request object
	req.user = user;

	next(); // Call next middleware
};

const verifyRefreshToken = async (req, res, next) => {
	try {
		const token = req.body.token;
		let userId = jwt.verify(token, process.env.JWT_REFRESH_SECRET).id;
		req.userId = userId;

		// verify if token is in store or not
		let storedRefreshToken = await getKey('rt_' + userId);

		if (!storedRefreshToken || storedRefreshToken.token !== token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized', data: err });
	}
};

const verifyAccessToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; // Will throw error if token is not present
		// Verify the token and store in request object
		let decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		req.userId = decoded.id;
		req.jwt_timeToExpire =
			new Date(decoded.exp).getTime() - new Date().getTime() / 1000;

		// Check if token is blacklisted (User logged out)
		let tokenBlacklisted = await getKey('bl_' + token);
		if (tokenBlacklisted) {
			return res.status(401).json({ message: 'Token Blacklisted' });
		}

		next(); // If token is valid, continue
	} catch (_err) {
		// If token is not valid, send 401 (unauthorized) status
		return res
			.status(401)
			.json({ message: 'Unauthorized requests are not allowed.' });
	}
};

module.exports = {
	loginPreProcessor,
	verifyRefreshToken,
	verifyAccessToken
};
