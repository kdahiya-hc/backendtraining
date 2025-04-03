// /routes/like.js
const _ = require('lodash');
const { Post } = require('../models/Post');
const { Like, validateLike: validate } = require('../models/Like');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true });

// Add a like
router.post('/add',auth, async (req, res, next) => {
	try {
		console.log("In like post");

		const postId = req.params.postId;
		const existingLike = await Like.findOne({ postId: postId, likedBy: req.user._id});

		if (existingLike) {
			return res.status(400).json({
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

// Remove a like
router.delete('/remove',auth, async (req, res, next) => {
	try {
		console.log("In dislike post");

		const postId = req.params.postId;
		const existingLike = await Like.deleteOne({ postId: postId, likedBy: req.user._id});

		if (!existingLike) {
			return res.status(400).json({
				success: false,
				message: 'You hadn\'t liked the post',
				value: { like: _.pick(existingLike, ['postId', 'likedBy']) }
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
				success: false,
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