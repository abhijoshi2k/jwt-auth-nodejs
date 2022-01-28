const Dashboard = (req, res) => {
	// User is authenticated and has a valid refresh token
	res.status(200)
		.json({
			message: 'Welcome to the dashboard',
			username: req.user.username,
			status: true
		})
		.end();
};

module.exports = { Dashboard };
