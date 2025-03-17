const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const asyncHandler = require('../middlewares/async.js')
const Joi = require('joi');
const router = express.Router();
const { User } = require('../models/user.js');

function validate(data) {
	const schema = Joi.object({
		email: Joi.string().min(12).email().trim().max(255).required(),
		password: Joi.string().min(8).trim().max(1024).required(),
	}).options({ stripUnknown: true });
	return schema.validate(data);
}

// Authenticate a user
router.post('/', asyncHandler(async (req, res) => {
	const { error, value } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const validUser = await User.findOne({ email: value.email });
	if (!validUser) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	const validPassword = await bcrypt.compare(value.password, validUser.password)
	if (!validPassword) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	// creating a JWT with ({payload}, {private_key})
	const token = validUser.generateAuthToken();

	res.status(200).json({ message: 'Authentication succesful', token : token});
}));

module.exports = router;
