const Dashboard = (req, res) => {
	res.json({
		message: 'Welcome to the dashboard',
		username: req.user.username
	});
};

module.exports = { Dashboard };
