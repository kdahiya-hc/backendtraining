// /routes/like.js
const _ = require('lodash');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const { Like, validateLike: validate } = require('../models/Like');
const auth = require('../middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });

// Add a like
router.post('/add',auth, async (req, res) => {
	try {
		console.log("In like post");

		const existingLike = await Like.findOne({ postId: req.params.postId, likedBy: req.user._id});

		if (existingLike) {
			return res.status(400).json({
				success: false,
				message: 'Like already exists',
				value: { like: _.pick(existingLike, ['postId', 'likedBy']) }
			});
		}

		const newLike = new Like({
			postId: req.params.postId,
			likedBy: req.user._id
		});

		await newLike.save();

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: req.params.postId },
			{ $inc: { likesCount: 1 } },
			{ new: true }
		)

		return res.status(200).json({
			success: true,
			message: 'Post liked successfully',
			value: { like: _.pick(updatedPost, ['_id', 'content','likesCount']) }
		});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Remove a like
router.post('/remove',auth, async (req, res) => {
	try {
		console.log("In dislike post");

		const existingLike = await Like.deleteOne({ postId: req.params.postId, likedBy: req.user._id});

		if (!existingLike) {
			return res.status(400).json({
				success: false,
				message: 'You hadn\'t liked the post',
				value: { like: _.pick(existingLike, ['postId', 'likedBy']) }
			});
		}

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: req.params.postId },
			{ $inc: { likesCount: -1 } },
			{ new: true }
		)

		return res.status(200).json({
			success: true,
			message: 'Post disliked successfully',
			value: { like: _.pick(updatedPost, ['_id', 'content','likesCount']) }
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