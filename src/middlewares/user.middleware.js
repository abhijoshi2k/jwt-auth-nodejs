// Import installed packages
const User = require('../models/User');

const findUser = async (req, res, next) => {
	try {
		let user = await User.findById(req.userId).exec();
		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.user = user;
		next();
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};

module.exports = { findUser };
