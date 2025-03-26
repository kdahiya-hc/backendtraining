const _ = require('lodash');
const { User, validate } = require('../models/User');
// const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Register a user
router.post('/register', async (req, res) => {
	try {
		console.log('In register');
		const {error, value} = validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const existingUser = await User.findOne({ email: value.email });

		if (existingUser) return res.status(400).json({ error: 'User with this email already exists' });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(value.password, salt);

		const newUser = new User({
			email: value.email,
			password: hashedPassword,
			name:value.name,
			address:value.apartment,
			dob: new Date(value.dob),
		})

		await newUser.save();

		return res.status(201).json({message: 'New user added', user: _.pick(newUser, ['email', 'name'])});
	} catch(err){
		console.log(err.message);
		return res.status(500).json({ message: 'Something happened', error: err.message});
	}
})

module.exports = router;