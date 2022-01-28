// Import installed packages
const mongoose = require('mongoose');

// Declare gender array
const genderArray = ['male', 'female', 'non-binary'];

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: {
				// Username validation
				validator: (username) => {
					return /^[._a-z0-9]{3,20}$/.test(username);
				},
				message:
					'Username must be between 3 and 20 characters long and can only contain letters, numbers, underscores and periods.'
			}
		},
		password: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: {
				// Email validation
				validator: (email) => {
					return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email);
				},
				message: 'Invalid email address.'
			}
		},
		gender: {
			type: String,
			required: false,
			validate: {
				// Make sure value is one of the values in gender array
				validator: (gender) => {
					return genderArray.includes(gender);
				},
				message: 'Invalid gender.'
			}
		},
		dateOfBirth: {
			type: String,
			required: false,
			validate: {
				// Make sure value is a valid date
				validator: (dob) => {
					if (isNaN(new Date(dob).getTime())) {
						return false;
					}
					return true;
				}
			}
		},
		contactNumber: {
			type: Number,
			required: true,
			validate: {
				// Make sure value is a valid phone number
				validator: (contactNumber) => {
					return ('' + contactNumber).length === 10;
				},
				message: 'Invalid contact number.'
			}
		},
		role: {
			type: String,
			required: true,
			default: 'user',
			enum: ['user', 'admin'] // Make sure value is one of the values in the enum array
		}
	},
	// Timestamps to keep track of when user was created and last updated
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
