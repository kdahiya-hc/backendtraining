const _ = require('lodash');const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {auth} = require('../middlewares/auth.js')
const {isAdmin} = require('../middlewares/admin.js')
const { User, validateUser } = require('../models/user.js');

// GET all users
router.get('/', [auth, isAdmin], async (req, res) => {
	const users = await User.find().sort('name');
	res.status(200).json(users);
});

// GET user by email
router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-password');
	res.status(200).json({ message: 'Authenticated the user', user: _.pick(user, ['name', 'email']) });
});

// POST create a user
router.post('/', async (req, res) => {
	// Validate the request body
	const { error, value } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Check if user already exists
	const existingUser = await User.findOne({ email: value.email });
	if (existingUser) {
		return res.status(400).json({ message: 'User already registered', user: _.pick(existingUser, ['_id', 'name', 'email']) });
	}

	const salt = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(value.password, salt);

	// Create and save the new user
	const newUser = new User({
		name: value.name,
		email: value.email,
		password: hashedPassword,
	});

	const token = newUser.generateAuthToken();
	await newUser.save();
	res.status(201).header('x-auth-token', token).json({ message: 'New user has been added successfully!', user: 	_.pick(newUser, ['_id', 'name', 'email'])});
});

// PUT update user by email
router.put('/:email', [auth, isAdmin], async (req, res) => {
	// Validate the request body
	const { error, value } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const salt = await bcrypt.genSalt(5);
	const hashedPassword = await bcrypt.hash(value.password, salt);

	const user = await User.findOneAndUpdate(
		{ email: req.params.email },
		{
			$set: {
				name: value.name,
				password: hashedPassword,
			},
		},
		{ new: true }
	);
	if (!user) {
		return res.status(404).json({ message: 'No user found with provided email.' });
	}

	res.status(200).json({ message: 'User has been updated successfully.', user: _.pick(user, ['_id', 'name', 'email']) });
});

// DELETE user by email
router.delete('/:email', [auth, isAdmin], async (req, res) => {
	const user = await User.findOneAndDelete({ email: req.params.email });
	if (!user) {
		return res.status(404).json({ message: 'No user found with provided email.' });
	}

	res.status(200).json({ message: 'User has been deleted successfully.', user:  _.pick(user, ['_id', 'name', 'email']) });
});

module.exports = router;
