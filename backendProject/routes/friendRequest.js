// /routes/friendRequest.js
const _ = require('lodash');
const { User } = require('../models/User');
const { FriendRequest, validateFriendRequest: validate } = require('../models/FriendRequest');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

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

		if (sender._id.toString() === receiver._id.toString()) {
			return res.status(400).json({
				success: false,
				message: 'You cannot send a friend request to yourself.',
				value: {}
			});
		}

		if (sender.friendsId.includes(value.to) && receiver.friendsId.includes(req.user._id)) {
			return res.status(400).json({
				success: false,
				message: 'You are already friends with this user',
				value: {}
			});
		}

		const existingRequest = await FriendRequest.findOne({
			$or: [
				{ from: req.user._id, to: value.to, status : 'pending' },
				{ from: value.to, to: req.user._id, status : 'pending' }
			]
		});

		if (existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'Friend request already exists',
				value: { requestId: _.pick(existingRequest, ['_id', 'status']) }
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

		const existingRequest = await FriendRequest.findOne({ _id: req.params.requestId, from: req.user._id, status : 'pending'})

		if (!existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'No pending friend request found or you are not authorized to cancel this request.',
				value: { }
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

		const existingRequest = await FriendRequest.findOne({ _id: req.params.requestId, to: req.user._id, status : 'pending'})

		if (!existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'No pending friend request found or you are not authorized to accept this request.',
				value: { }
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

		await FriendRequest.findByIdAndUpdate(
			req.params.requestId,
			{ status: 'accepted' },
			{ new : true }
		);

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

		const existingRequest = await FriendRequest.findOne({ _id: req.params.requestId, to: req.user._id, status : 'pending'})

		if (!existingRequest) {
			return res.status(400).json({
				success: false,
				message: 'No pending friend request found or you are not authorized to reject this request.',
				value: { }
			});
		}

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

		await FriendRequest.findByIdAndUpdate(
			req.params.requestId,
			{ status: 'rejected' },
			{ new: true }
		);

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

// Get pending/accepted/rejected friend requests
router.get('/:reqStatus', auth, async(req, res) => {
	try {
		console.log('In get all friend requests with pagination');

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		if (!['pending', 'accepted', 'rejected'].includes(req.params.reqStatus)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid status. Use pending, accepted, or rejected.',
				value: {}
			});
		}

		const totalRequests = await FriendRequest.countDocuments({ $or:[{ from: req.user._id }, { to: req.user._id}], status: req.params.reqStatus });
		const requests = await FriendRequest.find({ status: req.params.reqStatus, $or: [{ from: req.user._id }, { to: req.user._id }]})
								.skip(skip).limit(limit)
								.select('_id')
								.populate('from', 'name email')
								.populate('to', 'name email');

		if (requests.length === 0){
			return res.status(200).json({
				success: false,
				message: 'No friend requests found for the specified status.',
				value: { requests, totalRequests }
			});
		}

		const requestData = requests.map(request => ({
			id: request._id,
			from : request.from.name.firstName,
			to : request.to.name.firstName,
			status: request.status
		}))
		return res.status(200).json({
			success: true,
			message: 'Friend requests retrieved successfully.',
			value: { requests : requestData, totalRequests }
		});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

module.exports = router;