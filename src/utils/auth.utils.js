// Import installed packages
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

// Import custom modules
const { setKey } = require('../connections/redis.connection');

// Formatting Access and Refresh tokens' private keys
const JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY.replace(
	/\\n/g,
	'\n'
);
const JWT_ACCESS_PRIVATE_KEY = process.env.JWT_ACCESS_PRIVATE_KEY.replace(
	/\\n/g,
	'\n'
);

// Get access and refresh token expiry time in seconds (as Integer)
const jwtAccessLife = parseInt(process.env.JWT_ACCESS_LIFE);
const jwtRefreshLife = parseInt(process.env.JWT_REFRESH_LIFE);

// Regex for password
// At least one lowercase, one uppercase, one number, and one special character
// and between 6 and 16 characters
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

// Refresh token generator
const generateRefreshToken = async (userId) => {
	// Encrypt User ID and Generate refresh token
	const refresh_token = jwt.sign(
		{
			id: CryptoJS.AES.encrypt(
				userId,
				process.env.JWT_REFRESH_SECRET
			).toString()
		},
		JWT_REFRESH_PRIVATE_KEY,
		{
			expiresIn: jwtRefreshLife,
			algorithm: 'RS256'
		}
	);

	// Store refresh token in Redis
	await setKey('rt_' + userId, { token: refresh_token }, jwtRefreshLife);

	return refresh_token;
};

// Function to generate both access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
	// Generate access token
	const access_token = jwt.sign(
		{
			id: CryptoJS.AES.encrypt(
				userId,
				process.env.JWT_ACCESS_SECRET
			).toString()
		},
		JWT_ACCESS_PRIVATE_KEY,
		{
			expiresIn: jwtAccessLife,
			algorithm: 'RS256'
		}
	);

	// Generate refresh token
	const refresh_token = await generateRefreshToken(userId);

	// Return access and refresh token
	return { refresh_token, access_token };
};

// Password validator
const checkPasswordValidity = (password) => {
	// Check if password is of valid format using above regex
	return passwordRegex.test(password);
};

module.exports = {
	generateRefreshToken,
	generateAccessAndRefreshToken,
	checkPasswordValidity
};
