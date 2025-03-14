const Joi = require('joi');
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		minlength: 12,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		maxlength: 1024
	},
});

// Create a User model
const User = mongoose.model('users', userSchema);

// Validate user input using Joi
function validateUser(data) {
	const schema = Joi.object({
		name: Joi.string().min(3).trim().max(50).required(),
		email: Joi.string().min(12).email().trim().max(255).required(),
		password: Joi.string().min(8).trim().max(1024).required(),
	});
	return schema.validate(data);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
