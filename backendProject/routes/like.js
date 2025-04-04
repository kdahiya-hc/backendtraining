// /routes/like.js
const _ = require('lodash');
const { Post } = require('../models/Post');
const { Like, validateLike: validate } = require('../models/Like');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/likes/{postId}/add:
 *   post:
 *     tags:
 *       - likes
 *     summary: add a like
 *     description: |
 *       This end point is to add a like to a post if valid Id is in the path.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of friendRequest
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       201:
 *         description: Success in adding the like
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

// Add a like
router.post('/add',auth, async (req, res, next) => {
	try {
		console.log("In like post");
		const postId = req.params.postId;

		const post = await Post.findById(postId);
		if (!post) {
		  return res.status(404).json({
			success: false,
			message: 'Post not found',
			value: {}
		  });
		}

		const existingLike = await Like.findOne({ postId: postId, likedBy: req.user._id});

		if (existingLike) {
			return res.status(409).json({
				success: false,
				message: 'Like already exists',
				value: { like: _.pick(existingLike, ['postId', 'likedBy']) }
			});
		}

		const newLike = new Like({
			postId: postId,
			likedBy: req.user._id
		});

		await newLike.save();

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { likesCount: 1 } },
			{ new: true }
		)

		return res.status(201).json({
			success: true,
			message: 'Post liked successfully',
			value: { like: _.pick(updatedPost, ['_id', 'content','likesCount']) }
		});
	} catch(err) {
		next(err);
	}
})

/**
 * @swagger
 * /api/likes/{postId}/remove:
 *   delete:
 *     tags:
 *       - likes
 *     summary: remove a like
 *     description: |
 *       This end point is to remove a like to a post if valid Id is in the path.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of friendRequest
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in removing the like
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

// Remove a like
router.delete('/remove',auth, async (req, res, next) => {
	try {
		console.log("In dislike post");

		const postId = req.params.postId;

		const post = await Post.findById(postId);
		if (!post) {
		  return res.status(404).json({
			success: false,
			message: 'Post not found',
			value: {}
		  });
		}

		const deleteResult = await Like.deleteOne({ postId: postId, likedBy: req.user._id});

		if (deleteResult.deletedCount === 0) {
			return res.status(404).json({
			  success: false,
			  message: 'Like not found - you never liked this post',
			  value: {}
			});
		  }

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { likesCount: -1 } },
			{ new: true }
		)

		return res.status(200).json({
			success: true,
			message: 'Post disliked successfully',
			value: { like: _.pick(updatedPost, ['_id', 'content','likesCount']) }
		});
	} catch(err) {
		next(err);
	}
})

/**
 * @swagger
 * /api/likes/{postId}:
 *   get:
 *     tags:
 *       - likes
 *     summary: get all likes of a post
 *     description: |
 *       This end point is to get all like of a post if valid Id is in the path.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of friendRequest
 *         schema:
 *           $ref: "#/components/schemas/objectId"
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
 *         description: Success in getting all the likes
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

// Get all likes of a post and likesCount
router.get('/', async (req, res, next) => {
	try {
		console.log('In get all like and likesCount');

		const postId = req.params.postId;

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
			  success: false,
			  message: 'Post not found',
			  value: {}
			});
		  }

		const likesCount = post.likesCount;
		const likes = await Like.find({ postId: postId }).skip(skip).limit(limit);

		if (likes.length === 0){
			return res.status(200).json({
				success: true,
				message: 'You got some high expectations there, either there are no likes for this post or limit is high',
				value:{
					post: _.pick(post, ['content', 'postedBy']),
					likesCount: likesCount,
					recentLikes: _.pick(likes, ['postId', 'likedBy'])
				}
			})
		}

		return res.status(200).json({
			success: true,
			message: `Here are most recent ${limit-skip} likes.`,
			value:{
				post: _.pick(post, ['content', 'postedBy']),
				likesCount: likesCount,
				recentLikes: _.pick(likes, ['postId', 'likedBy'])
			}
		})
	} catch(err) {
		next(err);
	}
})

module.exports = router;