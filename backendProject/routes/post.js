const _ = require('lodash');
const { Post, validatePost: validate } = require('../models/Post');
const auth = require('../middlewares/auth');
const express = require('express');
const { default: mongoose, mongo } = require('mongoose');
const router = express.Router();

// Create a post
router.post('/create', auth, async (req, res) => {
	try{
		console.log('In create')
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
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

// Get a post, only if friend or owned
router.get('/:postId', auth, async (req, res) => {
	try{
		console.log('In get :postId')

		const post = await Post.findById(req.params.postId).populate('postedBy', 'friendsId');
		console.log(post.postedBy.friendsId);
		console.log(new mongoose.Types.ObjectId(req.user._id));
		if (post){
			const isOwner = new mongoose.Types.ObjectId(req.user._id).equals(post.postedBy._id)
			const isFriend = post.postedBy.friendsId.includes(req.user._id);
			console.log('isOwner: ', isOwner);
     		console.log('isFriend: ', isFriend);
			if (isOwner || isFriend) {
				return res.status(200).json({
					success: true,
					message: isOwner ? 'Your post found': 'Your friend\'s post found',
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

		return res.status(400).json({
					success: false,
					message: 'No post found',
					value: { }
				});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
})

module.exports = router