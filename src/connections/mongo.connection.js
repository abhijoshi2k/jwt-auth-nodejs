// Import installed packages
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => console.log('Error connecting to databse:\n', err));

module.exports = mongoose;
