// Import installed packages
const User = require('../models/User');

const findUser = async (req, res, next) => {
	try {
		// Find user by user ID in request object
		let user = await User.findById(req.userId).exec();

		// If user is not found, return 401 (unauthorized) status
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Unauthorized', status: false })
				.end();
		}

		// Store user in request object
		req.user = user;
		next(); // Call next middleware
	} catch (err) {
		// If error, return 500 (internal server error) status
		console.log(err);
		return res
			.status(500)
			.json({ message: 'Some error occurred', status: false })
			.end();
	}
};

module.exports = { findUser };
