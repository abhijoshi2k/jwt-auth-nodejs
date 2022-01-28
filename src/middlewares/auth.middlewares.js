// Import installed packages
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

// Import custom modules
const User = require('../models/User');
const { getKey } = require('../connections/redis.connection');
const { checkPasswordValidity } = require('../utils/auth.utils');

// Salt rounds for password
const saltRounds = parseInt(process.env.SALT_ROUNDS);

// Formatting access and refresh tokens' public keys
const JWT_ACCESS_PUBLIC_KEY = process.env.JWT_ACCESS_PUBLIC_KEY.replace(
	/\\n/g,
	'\n'
);
const JWT_REFRESH_PUBLIC_KEY = process.env.JWT_REFRESH_PUBLIC_KEY.replace(
	/\\n/g,
	'\n'
);

// Login PreProcessor
const loginPreProcessor = async (req, res, next) => {
	try {
		// Check if username and password are present and not empty
		if (
			!req.body.username ||
			!req.body.password ||
			req.body.username.trim() === '' ||
			req.body.password.trim() === ''
		) {
			return res.status(400).json({
				message: 'Invalid Credentials.',
				status: false
			});
		}

		// Check if username and password are valid
		let user = await User.findOne({
			username: req.body.username
		}).exec();

		// If user is not found, return 401 (unauthorized) status
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Invalid Credentials.', status: false })
				.end();
		}

		// Check if password is correct
		let passwordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		);

		// If password is incorrect, return 401 (unauthorized) status
		if (!passwordCorrect) {
			return res
				.status(401)
				.json({ message: 'Invalid Credentials.', status: false })
				.end();
		}

		// Store user in request object
		req.user = user;
		next(); // Call next middleware
	} catch (error) {
		// If error, return 500 (internal server error) status
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
	}
};

const signupPreProcessor = async (req, res, next) => {
	try {
		// Check if password is of valid format
		if (!checkPasswordValidity(req.body.password)) {
			return res.status(400).json({
				message: 'Password does not meet requirements',
				status: false
			});
		}
		// Hash password
		const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

		// Create new user object
		const user = new User({
			...req.body,
			password: hashPassword
		});

		// Add user object to request object
		req.user = user;
		next(); // Call next middleware
	} catch (error) {
		// If error, return 500 (internal server error) status
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
	}
};

const verifyRefreshToken = async (req, res, next) => {
	try {
		// Get refresh token from request body and extract user ID
		const { token } = req.body;
		let decodedId = jwt.verify(token, JWT_REFRESH_PUBLIC_KEY, {
			algorithms: ['RS256']
		}).id;

		// Decrypt User ID
		let userId = CryptoJS.AES.decrypt(
			decodedId,
			process.env.JWT_REFRESH_SECRET
		).toString(CryptoJS.enc.Utf8);

		// Error will be thrown if token is not valid or not present (undefined)
		req.userId = userId; // Store user ID in request object

		// verify if token is in store or not
		let storedRefreshToken = await getKey('rt_' + userId);

		// If token is not in store, return 401 (unauthorized) status
		if (!storedRefreshToken || storedRefreshToken.token !== token) {
			return res
				.status(401)
				.json({ message: 'Unauthorized request', status: false });
		}

		next(); // If token is valid, continue to next middleware
	} catch (err) {
		// If token verification fails, return 401 (unauthorized) status
		return res
			.status(401)
			.json({ message: 'Unauthorized request', status: false });
	}
};

const verifyAccessToken = async (req, res, next) => {
	try {
		// Get access token from request headers
		// Will throw error if token is not present
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token and store user ID in request object
		let decoded = jwt.verify(token, JWT_ACCESS_PUBLIC_KEY, {
			algorithms: ['RS256']
		});

		// Decrypt User ID
		req.userId = CryptoJS.AES.decrypt(
			decoded.id,
			process.env.JWT_ACCESS_SECRET
		).toString(CryptoJS.enc.Utf8);

		// Find the time left (in seconds) for the token to expire
		// This is needed for blacklisting the token during logoout
		req.jwt_timeToExpire =
			new Date(decoded.exp).getTime() - new Date().getTime() / 1000;

		// Check if token is blacklisted (User logged out)
		let tokenBlacklisted = await getKey('bl_' + token);
		if (tokenBlacklisted) {
			return res
				.status(401)
				.json({ message: 'Token Blacklisted', status: false })
				.end();
		}

		next(); // If token is valid, continue
	} catch (_err) {
		// If token is not valid, send 401 (unauthorized) status
		return res
			.status(401)
			.json({ message: 'Unauthorized request.', status: false })
			.end();
	}
};

module.exports = {
	loginPreProcessor,
	verifyRefreshToken,
	verifyAccessToken,
	signupPreProcessor
};
