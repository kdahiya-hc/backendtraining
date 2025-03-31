// /routes/friend.js
const _ = require('lodash');
const { User } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

// remove friend
router.delete('/remove/:friendId', auth, async (req, res) => {
	try {
		console.log('In Remove a friend');
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user found',
				value: { user : { } }
			});
		}

		if (user._id.equals(req.params.friendId)){
			return res.status(400).json({
				success: false,
				message: 'Expected, that you do not want to be friends with yourself',
				value: {}
			});
		}

		if (!user.friendsId.toString().includes(req.params.friendId)){
			return res.status(400).json({
				success: false,
				message: 'No friends with this Id',
				value: {}
			});
		}

		const removedFriend = await User.findById(req.params.friendId).select('_id name email');

		// For the req.params.friendId removing req.user._id
		await User.findByIdAndUpdate(
			req.params.friendId,
			{ $pull: { friendsId: req.user._id } },
			{ new: true }
		);

		// For the req.user._id removing the req.params.friendId
		await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { friendsId: req.params.friendId} },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: 'Friend has be removed successfully!',
			value: { Removed : removedFriend }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Get all friends details with pagination
router.get('/', auth, async (req, res) => {
	try {
		console.log('In get all friends with pagination');
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const user = await User.findById(req.user._id).populate({
			path: 'friendsId',
			select: '_id email name'
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user found',
				value: { user : { } }
			});
		}

		const totalFriends = user.friendsId.length;
		const friends = user.friendsId.slice(skip, skip + limit);

		if (friends.length === 0){
			return res.status(200).json({
				success: false,
				message: 'You either have no friends of too high expectation. Add some friends or try removing all the limits!',
				value : { friends, totalFriends }
			});
		}

		const friendsData = friends.map(friend => _.pick(friend, ['_id', 'email', 'name']))

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