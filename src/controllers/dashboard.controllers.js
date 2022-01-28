const Dashboard = (req, res) => {
	res.status(200)
		.json({
			message: 'Welcome to the dashboard',
			username: req.user.username,
			status: true
		})
		.end();
};

module.exports = { Dashboard };
