// /routes/user.js
const _ = require('lodash');
const { User, validateUpdateUser: validateUpdate } = require('../models/User');
const { Post } = require('../models/Post');
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
router.patch('/me', auth, async (req, res) => {
	try {
		console.log('In update /me')
		const { error, value } = validateUpdate(req.body);
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

// Get user page with id if friend
router.get('/profile/:userId', auth, async (req, res) => {
	try {
		console.log('In get page by ID');

		const otherUserId = req.params.userId;
		const myUserId = req.user._id;

		const me = await User.findById(myUserId);
		const other = await User.findById(otherUserId);

		const isMe = myUserId === otherUserId ? true : false;
		const isFriend = me.friendsId.some(id => id.equals(otherUserId));
		// console.log(`isMe: ${isMe}`);
		// console.log(`isFriend: ${isFriend}`);

		if(isMe || isFriend){
			const pageOf = isFriend? otherUserId: myUserId;
			const posts = await Post.find({ postedBy: pageOf}).populate('commentsId', '-_id commentedBy content');
			const profile = isFriend? other : me;
			return res.status(200).json({
				success: true,
				message: 'User profile and posts fetched successfully',
				value: {
				  user: _.pick(profile, ['email', 'name', 'address', 'dob']),
				  post: posts.map(post => _.pick(post, ['content', 'imageURL', 'likesCount', 'commentsId', 'postedBy']))
				},
			  });
		}

		return res.status(403).json({
			success: false,
			message: 'You are not authorized to view this profile',
			value: {},
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