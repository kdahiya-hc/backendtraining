// /routes/user.js
const _ = require('lodash');
const { User, validateUpdateUser: validateUpdate } = require('../models/User');
const { Post } = require('../models/Post');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - users
 *     summary: get all users
 *     description: |
 *       This end point is to get all users
 *     security:
 *       - authToken: []
 *     parameters:
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
 *         description: Success in getting all the users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
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

// Get all users details with pagination
router.get('/', auth, async (req, res, next) => {
	try {
		console.log('In get all users with pagination');

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const totalUsers = await User.countDocuments();
		const users = await User.find().skip(skip).limit(limit);

		if (users.length === 0){
			return res.status(200).json({
				success: true,
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
		next(err);
	}
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags:
 *       - users
 *     summary: get my detail
 *     description: |
 *       This end point is to get logged in user detail
 *     security:
 *       - authToken: []
 *     responses:
 *       200:
 *         description: Success in getting detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/notFoundResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Get logged in user details
router.get('/me', auth, async (req, res, next) => {
	try {
		console.log('In get /me');

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
		next(err);
	}
})

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     tags:
 *       - users
 *     summary: update my detail
 *     description: |
 *       This end point is to update logged in user detail partially
 *     security:
 *       - authToken: []
 *     requestBody:
 *       description: Needs valid user data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/updateUser"
 *     responses:
 *       200:
 *         description: Success in updating user detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/notFoundResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Update logged in user details
router.patch('/me', auth, async (req, res, next) => {
	try {
		console.log('In update /me');

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
		next(err);
	}
})

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     tags:
 *       - users
 *     summary: get the page of user or friend
 *     description: |
 *       This end point is to the page of logged in user or their friend, with details and post
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The 24 hexadecimal characters Id of user or friend
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in getting page
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
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
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/notFoundResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Get user page with id if friend
router.get('/profile/:userId', auth, async (req, res, next) => {
	try {
		console.log('In get page by ID');

		const otherUserId = req.params.userId;
		const myUserId = req.user._id;

		const me = await User.findById(myUserId);
		const other = await User.findById(otherUserId);
		if (!other || !me) {
		return res.status(404).json({
			success: false,
			message: 'User not found',
			value: {}
		});
		}

		const isMe = myUserId === otherUserId;
		const isFriend = me.friendsId.some(id => id.equals(otherUserId));
		// console.log(`isMe: ${isMe}`);
		// console.log(`isFriend: ${isFriend}`);

		if (!isMe && !isFriend) {
		return res.status(403).json({
			success: false,
			message: 'You are not authorized to view this profile',
			value: {},
		});
		}

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const pageOf = isFriend? otherUserId: myUserId;
		const posts = await Post.find({ postedBy: pageOf })
							.skip(skip)
							.limit(limit)
							.populate('commentsId', '-_id commentedBy content');
		const profile = isFriend? other : me;
		return res.status(200).json({
			success: true,
			message: 'User profile and posts fetched successfully',
			value: {
				user: _.pick(profile, ['name', 'address', 'dob']),
				post: posts.map(post => _.pick(post, ['content', 'imageURL', 'likesCount', 'commentsId', 'postedBy']))
			},
			});
	} catch(err) {
		next(err);
	}
});

module.exports = router