// Import custom modules
const { delKey, setKey } = require('../connections/redis.connection');
const { generateAccessAndRefreshToken } = require('../utils/auth.utils');

const Signup = async (req, res) => {
	try {
		// Save user to database
		const newUser = await req.user.save();

		// Generate access and refresh token
		let tokens = await generateAccessAndRefreshToken(
			newUser._id.toHexString()
		);

		// Respond with access and refresh token
		return res.status(200).json(tokens);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const Login = async (req, res) => {
	try {
		// Generate access and refresh token
		let tokens = await generateAccessAndRefreshToken(
			req.user._id.toHexString()
		);

		// Respond with access and refresh token
		return res.status(200).json(tokens);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const RefreshToken = async (req, res) => {
	try {
		// Generate access and refresh token
		let tokens = await generateAccessAndRefreshToken(req.userId);

		// Respond with access and refresh token
		return res.status(200).json(tokens);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const Logout = async (req, res) => {
	try {
		// Remove refresh token from store
		await delKey('rt_' + req.userId);

		// Add access token to blacklist
		setKey(
			'bl_' + req.headers.authorization.split(' ')[1],
			true,
			parseInt(req.jwt_timeToExpire)
		);

		// Respond with success
		return res.status(200).json({ message: 'Logout Successful' });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

module.exports = { Signup, Login, RefreshToken, Logout };
