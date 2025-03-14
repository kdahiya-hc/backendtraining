const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
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

// POST create a user
router.post('/', async (req, res) => {
	const { error, value } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
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
	} catch (err) {
		res.status(500).json({ message: 'Error saving the user', error: err.message });
	}
});

module.exports = router;
