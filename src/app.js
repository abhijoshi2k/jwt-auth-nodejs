require('dotenv').config(); // Load environment variables from .env file

// Import installed packages
const express = require('express');

const app = express(); // Create express app

// Parse incoming request bodies in a middleware before handlers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize MongoDB connection
require('./connections/mongo.connection');

// Add routes
app.use('/', require('./routes/auth.routes'));
app.use('/dashboard', require('./routes/dashboard.routes'));

// 404
app.use((req, res) => {
	res.status(404).json({
		message: 'Not Found'
	});
});

// Listen to available port/3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

// For testing only
if (process.env.NODE_ENV === 'test') {
	module.exports = app;
}
