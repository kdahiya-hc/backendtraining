// /routes/friendRequest.js
const _ = require('lodash');
const { User } = require('../models/User');
const { FriendRequest, validateFriendRequest: validate } = require('../models/FriendRequest');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/friends/requests/send:
 *   post:
 *     tags:
 *       - friendRequests
 *     summary: Manage friend requests
 *     description: |
 *       This end point is to send a friend request to user with valid request body.
 *     security:
 *       - authToken: []
 *     requestBody:
 *       description: Needs valid request data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/friendRequest"
 *     responses:
 *       200:
 *         description: Success in sending the friend request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/badRequestResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/forbiddenResponse"
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/conflictResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Send friend request. Sender's Action
router.post('/send', auth, async (req, res, next) => {
	try {
		console.log('In send friend request');

		const { error, value } = validate(req.body);
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		}

		const sender = await User.findById(req.user._id);
		const receiver = await User.findById(value.to);

		if (sender._id.toString() === receiver._id.toString()) {
			return res.status(403).json({
				success: false,
				message: 'You cannot send a friend request to yourself.',
				value: {}
			});
		}

		if (sender.friendsId.includes(value.to) && receiver.friendsId.includes(req.user._id)) {
			return res.status(409).json({
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
			return res.status(409).json({
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
		next(err);
	}
})

/**
 * @swagger
 * /api/friends/requests/{requestId}/cancel:
 *   delete:
 *     tags:
 *       - friendRequests
 *     summary: cancel friend requests
 *     description: |
 *       This end point is to cancel a friend request of a user with valid parameter in query.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: The 24 hexadecimal characters Id of friendRequest
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in cancelling the friend request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/notFoundResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Cancel friend request. Sender's action
router.delete('/:requestId/cancel', auth, async (req, res, next) => {
	try {
		console.log('In cancel friend request');

		const existingRequest = await FriendRequest.findOne({ _id: req.params.requestId, from: req.user._id, status : 'pending'})

		if (!existingRequest) {
			return res.status(404).json({
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
		next(err);
	}
})

/**
 * @swagger
 * /api/friends/requests/{requestId}/accept:
 *   put:
 *     tags:
 *       - friendRequests
 *     summary: accept friend requests
 *     description: |
 *       This end point is to accept a friend request of a user with valid parameter in query.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: The 24 hexadecimal characters Id of friendRequest
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in accepting the friend request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/notFoundResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Accept (receiver's Action) friend request
router.put('/:requestId/accept', auth, async (req, res, next) => {
	try {
		console.log('In accept friend request');

		const existingRequest = await FriendRequest.findOne({ _id: req.params.requestId, to: req.user._id, status : 'pending'})

		if (!existingRequest) {
			return res.status(404).json({
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
		next(err);
	}
})

/**
 * @swagger
 * /api/friends/requests/{requestId}/reject:
 *   put:
 *     tags:
 *       - friendRequests
 *     summary: reject friend requests
 *     description: |
 *       This end point is to reject a friend request of a user with valid parameter in query.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: The 24 hexadecimal characters Id of friendRequest
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in rejecting the friend request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/notFoundResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Reject (Receiver's Action) friend request
router.put('/:requestId/reject', auth, async (req, res, next) => {
	try {
		console.log('In reject friend request');

		const existingRequest = await FriendRequest.findOne({ _id: req.params.requestId, to: req.user._id, status : 'pending'})

		if (!existingRequest) {
			return res.status(404).json({
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
		next(err);
	}
})

/**
 * @swagger
 * /api/friends/requests/{reqStatus}:
 *   get:
 *     tags:
 *       - friendRequests
 *     summary: get friend requests
 *     description: |
 *       This end point is to get all friend requests from to to the user with valid parameter in query for status.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: reqStatus
 *         required: true
 *         description: The status of friendRequest.
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - declined
 *             - accepted
 *       - in: query
 *         name: page
 *         description: The index of request we are start at
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: The limit of request objects we shall fetch
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Success in getting the friend requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       204:
 *         description: Success but not Content to get
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/noContentResponse"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/badRequestResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Get pending/accepted/rejected friend requests
router.get('/:reqStatus', auth, async(req, res, next) => {
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

		const totalRequests = await FriendRequest.countDocuments({
			$or:[
				{ from: req.user._id },
				{ to: req.user._id }
			],
				status: req.params.reqStatus
			});

		const requests = await FriendRequest.find({ status: req.params.reqStatus, $or: [{ from: req.user._id }, { to: req.user._id }]})
								.skip(skip).limit(limit)
								.select('_id')
								.populate('from', 'name')
								.populate('to', 'name');

		if (requests.length === 0){
			return res.status(204).json({
				success: true,
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
		next(err);
	}
})

module.exports = router;