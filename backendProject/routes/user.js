const _ = require('lodash');
const { User, validate } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

// Get all users details with pagination
router.get('/', auth, async (req, res) => {
	try {
		console.log('In get all with pagination')
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const totalUsers = await User.countDocuments();
		const users = await User.find().skip(skip).limit(limit);

		if (users.length === 0) return res.status(200).json({ message: 'No Users found', users : [] });

		const usersData = users.map(user => _.pick(user, ['email', 'name']))
		return res.status(200).json({ message: 'Users found', users : usersData, totalUsers });
	} catch(err) {
		console.log(err.message);
		return res.status(500).json({ message: 'Something happened', error: err.message});
	}
});

// Get logged in user details
router.get('/me', auth, async (req, res) => {
	try {
		console.log('In view own page')
		const user = await User.findById({ _id : req.user._id });

		if (!user) return res.status(404).json({ message: 'No user found' });

		return res.status(200).json({ message: 'User found', user: _.pick(user, ['email', 'name']) });
	} catch(err){
		console.log(err.message);
		return res.status(500).json({ message: 'Something happened', error: err.message});
	}
})

// Update logged in user details
router.put('/me', auth, async (req, res) => {
	try {
		console.log('In update')
		const { error, value } = validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const user = await User.findOneAndUpdate(
			{ _id : req.user._id },
			{
				$set: {
					name:value.name,
					address:value.address,
					dob: value.dob,
				},
			},
			{ new: true}
		);

		if (!user) return res.status(404).json({ message: 'No user found' });

		return res.status(200).json({ message: 'User updated successfully', user: _.pick(user, ['email', 'name']) });
	} catch(err){
		console.log(err.message);
		return res.status(500).json({ message: 'Something happened', error: err.message});
	}
})

// Get user detail with id
router.get('/:id', auth, async (req, res) => {
	try {
		console.log('In get user detail by ID');
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json({ message: 'No user found' });

		const userData = _.pick(user, ['email', 'name']);
		return res.status(200).json({user : userData});
	} catch(err) {
		console.log(err.message);
		return res.status(500).json({error: err.message});
	}
});

module.exports = router