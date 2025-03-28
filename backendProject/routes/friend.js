const _ = require('lodash');
const { User } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

// Get all friends details with pagination
router.get('/', auth, async (req, res) => {
	try {
		console.log('In get all friends with pagination');
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const user = await User.findById(req.user._id).populate({
			path: 'friendsId',
			select: 'email name'
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user found',
				value: { user : { } }
			});
		};

		const totalFriends = user.friendsId.length;
		const friends = user.friendsId.slice(skip, skip + limit);

		if (friends.length === 0){
			return res.status(200).json({
				success: false,
				message: 'Nothing to show on this page, try removing all the limits!',
				value : { friends, totalFriends }
			});
		}

		const friendsData = friends.map(friend => _.pick(friend, ['email', 'name']))

		return res.status(200).json({
			success: true,
			message: 'Request successful',
			value: { friends : friendsData, totalFriends }
		});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
});

module.exports = router;