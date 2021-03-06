// Import custom modules
const { delKey, setKey } = require('../connections/redis.connection');
const { generateAccessAndRefreshToken } = require('../utils/auth.utils');

const Signup = async (req, res) => {
	try {
		// Save user to database
		const newUser = await req.user.save();

		// Generate access and refresh token
		let tokens = await generateAccessAndRefreshToken(newUser._id.toHexString());

		// Respond with access and refresh token
		return res
			.status(200)
			.json({ ...tokens, status: true, message: 'Signup Successful' })
			.end();
	} catch (error) {
		// Check if error is a validation error
		if (error.errors) {
			let errorStr = '';
			for (let key in error.errors) {
				errorStr += error.errors[key].message + ' ';
			}
			return res
				.status(400)
				.json({ message: errorStr.trim(), status: false })
				.end();
		}

		// Check if error is a mongoose duplicate key error (code 11000)
		if (error.code === 11000) {
			return res
				.status(409)
				.json({ message: 'User already registered', status: false })
				.end();
		}

		// Internal server error
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
	}
};

const Login = async (req, res) => {
	try {
		// Generate access and refresh token
		let tokens = await generateAccessAndRefreshToken(
			req.user._id.toHexString()
		);

		// Respond with access and refresh token
		return res
			.status(200)
			.json({ ...tokens, status: true, message: 'Login Successful' })
			.end();
	} catch (error) {
		// Internal server error
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
	}
};

const RefreshToken = async (req, res) => {
	try {
		// Generate access and refresh token
		let tokens = await generateAccessAndRefreshToken(req.userId);

		// Respond with access and refresh token
		return res
			.status(200)
			.json({ ...tokens, status: true, message: 'Tokens Refreshed' })
			.end();
	} catch (error) {
		// Internal server error
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
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
		return res
			.status(200)
			.json({ message: 'Logout Successful', status: true })
			.end();
	} catch (error) {
		// Internal server error
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
	}
};

module.exports = { Signup, Login, RefreshToken, Logout };
