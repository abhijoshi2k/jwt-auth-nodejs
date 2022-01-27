// Import installed packages
const jwt = require('jsonwebtoken');
const { convertMany } = require('convert');

// Import custom modules
const { setKey } = require('../connections/redis.connection');

const jwtRefreshSeconds = convertMany(process.env.JWT_REFRESH_TIME).to(
	'seconds'
);

const generateRefreshToken = async (userId) => {
	// Generate refresh token
	const refresh_token = jwt.sign(
		{ id: userId },
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: process.env.JWT_REFRESH_TIME }
	);

	// Store refresh token in Redis
	await setKey('rt_' + userId, { token: refresh_token }, jwtRefreshSeconds);

	return refresh_token;
};

const generateAccessAndRefreshToken = async (userId) => {
	// Generate access token
	const access_token = jwt.sign(
		{ id: userId },
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: process.env.JWT_ACCESS_TIME }
	);

	// Generate refresh token
	const refresh_token = await generateRefreshToken(userId);

	// Return access and refresh token
	return { refresh_token, access_token };
};

module.exports = { generateRefreshToken, generateAccessAndRefreshToken };
