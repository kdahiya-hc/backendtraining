const _ = require('lodash');
const { User, validateUser: validate } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

// Get all users details with pagination
router.get('/', auth, async (req, res) => {
	try {
		console.log('In get all users with pagination')
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const totalUsers = await User.countDocuments();
		const users = await User.find().skip(skip).limit(limit);

		if (users.length === 0){
			return res.status(200).json({
				success: false,
				message: 'Nothing to show on this page, try removing all the limits!',
				value : { users, totalUsers }
			});
		}

		const usersData = users.map(user => _.pick(user, ['email', 'name']))
		return res.status(200).json({
			success: true,
			message: 'Request successful',
			value: { users : usersData, totalUsers }
		});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
});

// Get logged in user details
router.get('/me', auth, async (req, res) => {
	try {
		console.log('In get /me')
		const user = await User.findById({ _id : req.user._id });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user found',
				value: { user : { } }
			});
		}

		return res.status(200).json({
			success: true,
			message: 'User found',
			value: { user: _.pick(user, ['email', 'name']) }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Update logged in user details
router.put('/me', auth, async (req, res) => {
	try {
		console.log('In update /me')
		const { error, value } = validate(req.body);
		if (error) {
			return res.status(500).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		}

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

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user updated',
				value: { user : { } }
			});
		}

		return res.status(200).json({
			success: true,
			message: 'User updated successfully',
			value: { user: _.pick(user, ['email', 'name']) }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Get user detail with id
router.get('/:id', auth, async (req, res) => {
	try {
		console.log('In get user detail by ID');
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user updated',
				value: { user : { } }
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Query succesful',
			value : { user: _.pick(user, ['email', 'name']) }
		});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
});

module.exports = router