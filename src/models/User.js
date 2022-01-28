const mongoose = require('mongoose');

const genderArray = ['male', 'female', 'non-binary'];

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: {
				validator: (username) => {
					return /^[._a-z0-9]{3,20}$/.test(username);
				},
				message:
					'only lowercase letters, numbers, and underscores are allowed and must be between 3 and 20 characters long'
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
				validator: (email) => {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
						email
					);
				},
				message: 'invalid email address'
			}
		},
		gender: {
			type: String,
			required: false,
			validate: {
				validator: (gender) => {
					return genderArray.includes(gender);
				},
				message: 'Invalid gender'
			}
		},
		dateOfBirth: {
			type: String,
			required: false,
			validate: {
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
				validator: (contactNumber) => {
					return ('' + contactNumber).length === 10;
				},
				message: 'invalid contact number'
			}
		},
		role: {
			type: String,
			required: true,
			default: 'user',
			enum: ['user', 'admin']
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
