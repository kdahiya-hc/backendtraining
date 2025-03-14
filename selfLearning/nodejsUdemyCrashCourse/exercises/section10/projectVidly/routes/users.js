const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user.js');

// GET all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find().sort('name');
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving the users', error: err.message });
	}
});

// GET user by email
router.get('/:email', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.params.email });
		if (!user) {
			return res.status(404).json({ message: 'No user found with provided email.' });
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving the user', error: err.message });
	}
});

// POST create a user
router.post('/', async (req, res) => {
	// Validate the request body
	const { error, value } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email: value.email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already registered', user: existingUser });
		}

		// Create and save the new user
		const newUser = new User({
			name: value.name,
			email: value.email,
			password: value.password,
		});
		await newUser.save();
		res.status(201).json({ message: 'New user has been added successfully!', user: newUser });
	} catch (err) {
		res.status(500).json({ message: 'Error saving the user', error: err.message });
	}
});

// PUT update user by email
router.put('/:email', async (req, res) => {
	// Validate the request body
	const { error, value } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const user = await User.findOneAndUpdate(
			{ email: req.params.email },
			{
				$set: {
					name: value.name,
					email: value.email,
					password: value.password,
				},
			},
			{ new: true }
		);
		if (!user) {
			return res.status(404).json({ message: 'No user found with provided email.' });
		}

		res.status(200).json({ message: 'User has been updated successfully.', user });
	} catch (err) {
		res.status(500).json({ message: 'Error updating the user', error: err.message });
	}
});

// DELETE user by email
router.delete('/:email', async (req, res) => {
	try {
		const user = await User.findOneAndDelete({ email: req.params.email });
		if (!user) {
			return res.status(404).json({ message: 'No user found with provided email.' });
		}

		res.status(200).json({ message: 'User has been deleted successfully.', user });
	} catch (err) {
		res.status(500).json({ message: 'Error deleting the user', error: err.message });
	}
});

module.exports = router;
