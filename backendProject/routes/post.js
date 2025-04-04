// /routes/post.js
const _ = require('lodash');
const { User } = require('../models/User');
const { Post, validatePost: validate } = require('../models/Post');
const auth = require('../middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/posts/create:
 *   post:
 *     tags:
 *       - posts
 *     summary: Create a post
 *     description: |
 *       It checks if entered data is valid and creates a post into the database.
 *     security:
 *       - authToken: []
 *     requestBody:
 *       description: Needs valid post data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/post"
 *     responses:
 *       201:
 *         description: Success in creating a post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       400:
 *         description: Wrong details passed
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

// Create a post
router.post('/create', auth, async (req, res, next) => {
	try{
		console.log('In create post');

		const { error, value } = validate(req.body);
		if (error) {
			return res.status(500).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		};
		const newPost = new Post({
			content: value.content,
			imageURL: value.imageURL,
			postedBy: req.user._id
		});

		await newPost.save();

		return res.status(201).json({
					success: true,
					message: 'New post created',
					value: { post: _.pick(newPost, ['content', 'imageURL', 'likesCount', 'commentsId' ,'postedBy']) }
				});
	} catch(err) {
		next(err);
	}
})

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     tags:
 *       - posts
 *     summary: get the post
 *     description: |
 *       This end point is to get post if the user is friend or owner
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of post
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in getting the post
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

// Get a post, only if friend or owned
router.get('/:postId', auth, async (req, res, next) => {
	try{
		console.log('In get post by postId');

		const post = await Post.findById(req.params.postId).populate('commentsId', 'commentedBy content');

		if (post){
			const user = await User.findById(req.user._id);
			// below are ObjectId so either make them object Id or make them string and fetch
			// const isOwner = req.user._id === post.postedBy._id.toString();
			const isOwner = new mongoose.Types.ObjectId(req.user._id).equals(post.postedBy._id);
			// below are array so either use include or some
			// const isFriend = user.friendsId.some(friendId => friendId.equals(post.postedBy._id));
			const isFriend = user.friendsId.includes(post.postedBy._id);

			if (isOwner || isFriend) {
				return res.status(200).json({
					success: true,
					message: isOwner ? 'Found your post': 'Found your friend\'s post',
					value: { post: _.pick(post, ['content', 'imageURL', 'likesCount', 'commentsId', 'postedBy']) }
				});
			} else{
				return res.status(403).json({
					success: false,
					message: 'You are not authorized to view this post',
					value: {}
				});
			}
		}

		return res.status(404).json({
					success: false,
					message: 'No post found',
					value: { }
				});
	} catch(err) {
		next(err);
	}
})

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     tags:
 *       - posts
 *     summary: update the post
 *     description: |
 *       This end point is to update post if the user is owner
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of post
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in updating the post
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

// Update post only if owned
router.put('/:postId', auth, async (req, res, next) => {
	try{
		console.log('In Update post with postId');

		const { error, value } = validate(req.body);
		if (error) {
			return res.status(500).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		};
		const updatedPost = await Post.findOneAndUpdate(
			// this is like find/where condition with key and values
			{ _id: req.params.postId, postedBy: req.user._id },
			// This is to set now
			{ $set: { content: value.content, imageURL: value.imageURL }},
			// This is like ensuring the object here after is modified one
			{ new : true }
		);

		if (!updatedPost) {
			return res.status(404).json({
				success: false,
				message: 'Post not found or You are not authorized to edit this post',
				value: { updatedPost }
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Post updated successfully!',
			value: { post: _.pick(updatedPost, ['content', 'imageURL', 'likesCount', 'commentsId', 'postedBy']) }
		});
	} catch(err) {
		next(err);
	}
})

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     tags:
 *       - posts
 *     summary: delete the post
 *     description: |
 *       This end point is to delete post if the user is owner
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of post
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in deleting the post
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

// Get a post and delete it only if owned
router.delete('/:postId', auth, async (req, res, next) => {
	try{
		console.log('In delete post with postId');

		const deletedPost = await Post.findOneAndDelete(
			{ _id: req.params.postId, postedBy: req.user._id },
		);

		if (!deletedPost) {
			return res.status(404).json({
				success: false,
				message: 'Post not found or You are not authorized to delete this post',
				value: { deletedPost }
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Post deleted successfully!',
			value: { post: _.pick(deletedPost, ['content', 'imageURL', 'likesCount', 'commentsId', 'postedBy']) }
		});
	} catch(err) {
		next(err);
	}
})

module.exports = router