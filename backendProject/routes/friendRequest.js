const _ = require('lodash');
const { FriendRequest, validateFriendRequest: validate } = require('../models/FriendRequest');
const { User } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Send friend request
router.post('/', auth, async (req, res) => {
	try {
		console.log('In send friend request');
		const { error, value } = validate(req.body);
		if (error) {
			return res.status(500).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		}

		const sender = await User.findById(req.user._id);
		const receiver = await User.findById(value.to);

		if (sender.friendsId.includes(value.to) && receiver.friendsId.includes(req.user._id)) {
			return res.status(400).json({
				success: false,
				message: 'You are already friends with this user',
				value: {}
			});
		}

		const existingRequest = await FriendRequest.findOne({
			$or: [
				{ from: req.user._id, to: value.to, status : { $in: ['rejected', 'pending'] } },
				{ from: value.to, to: req.user._id, status : { $in : ['rejected', 'pending'] } }
			]
		});

		if (existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'Friend request already exists',
				value: { requestId: _.pick(existingRequest, ['_id']) }
			});
		}

		const newFriendRequest = new FriendRequest({
			message: value.message,
			from: req.user._id,
			to: value.to
		});

		await newFriendRequest.save();

		// For the recipient
		await User.findByIdAndUpdate(
			value.to,
			{ $push: { pendingRequestsId: newFriendRequest._id } },
			{ new: true }
		);

		// For the sender
		await User.findByIdAndUpdate(
			req.user._id,
			{ $push: { pendingRequestsId: newFriendRequest._id } },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: 'Friend request sent successfully!',
			value: { friendRequest: newFriendRequest }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Cancel friend request

// Accept (Sender's Action) friend request

// Reject (Receiver's Action) friend request

module.exports = router;