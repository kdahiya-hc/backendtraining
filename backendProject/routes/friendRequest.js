const _ = require('lodash');
const { FriendRequest, validateFriendRequest: validate } = require('../models/FriendRequest');
const { User } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Send friend request. Sender's Action
router.post('/send', auth, async (req, res) => {
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
			value: { friendRequest: _.pick(newFriendRequest, ['_id', 'to', 'message']) }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Cancel friend request. Sender's action
router.delete('/:requestId/cancel', auth, async (req, res) => {
	try {
		console.log('In cancel friend request');

		const existingRequest = await FriendRequest.findById(req.params.requestId);

		if (!existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'No friend request found',
				value: { }
			});
		}

		if (!existingRequest.from.equals(req.user._id)) {
			return res.status(400).json({
				success: false,
				message: 'You didn\'t send this request hence you aren\'t authorized to cancel the request',
				value: {}
			});
		}

		// For the recipient
		await User.findByIdAndUpdate(
			existingRequest.to,
			{ $pull: { pendingRequestsId: existingRequest._id } },
			{ new: true }
		);

		// For the sender
		await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { pendingRequestsId: existingRequest._id } },
			{ new: true }
		);

		await FriendRequest.findByIdAndDelete(req.params.requestId);

		return res.status(200).json({
			success: true,
			message: 'Friend request cancelled!',
			value: { }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Accept (receiver's Action) friend request
router.put('/:requestId/accept', auth, async (req, res) => {
	try {
		console.log('In accept friend request');

		const existingRequest = await FriendRequest.findById(req.params.requestId);

		if (!existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'No friend request found',
				value: { }
			});
		}

		if (!existingRequest.to.equals(req.user._id)) {
			return res.status(400).json({
				success: false,
				message: 'You sent this request hence you aren\'t authorized to accept the request',
				value: {}
			});
		}

		// For the recipient
		await User.findByIdAndUpdate(
			existingRequest.to,
			{ $push: { friendsId: existingRequest.from } },
			{ new: true }
		);

		// For the sender
		await User.findByIdAndUpdate(
			existingRequest.from,
			{ $push: { friendsId: existingRequest.to } },
			{ new: true }
		);

		// For the sender
		await User.findByIdAndUpdate(
			existingRequest.from,
			{ $pull: { pendingRequestsId: existingRequest._id } },
			{ new: true }
		);

		// For the recipient
		await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { pendingRequestsId: existingRequest._id } },
			{ new: true }
		);

		await FriendRequest.findByIdAndDelete(req.params.requestId);

		return res.status(200).json({
			success: true,
			message: 'Friend request accepted!',
			value: { }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Reject (Receiver's Action) friend request
router.delete('/:requestId/reject', auth, async (req, res) => {
	try {
		console.log('In reject friend request');

		const existingRequest = await FriendRequest.findById(req.params.requestId);

		if (!existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'No friend request found',
				value: { }
			});
		}

		if (!existingRequest.to.equals(req.user._id)) {
			return res.status(400).json({
				success: false,
				message: 'You sent this request hence you aren\'t authorized to reject the request',
				value: {}
			});
		}

		// For the recipient
		await User.findByIdAndUpdate(
			existingRequest.to,
			{ $pull: { pendingRequestsId: existingRequest._id } },
			{ new: true }
		);

		// For the sender
		await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { pendingRequestsId: existingRequest._id } },
			{ new: true }
		);

		await FriendRequest.findByIdAndDelete(req.params.requestId);

		return res.status(200).json({
			success: true,
			message: 'Friend request rejected!',
			value: { }
		});
	} catch(err){
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

module.exports = router;