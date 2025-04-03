// /routes/comment.js
const _ = require('lodash');
const { Post } = require('../models/Post');
const { Comment, validateComment: validate } = require('../models/Comment');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true }); // This merge params is getting :postId

// update a comment
router.patch('/:commentId/update',auth, async (req, res, next) => {
	try {
		console.log("In update a comment on a post");

		const { error, value } = validate(req.body);
		if (error) {
			return res.status(500).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		}

		const commentId = req.params.commentId;

		const updatedComment = await Comment.findByIdAndUpdate(
			commentId,
			{ content: value.content },
			{ new : true }
		)

		if (!updatedComment) {
			return res.status(400).json({
				success: false,
				message: 'Comment not found',
				value: { }
			});
		}

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully!',
            value: { comment: _.pick(updatedComment, ['content', 'postId']) }
        });
	} catch(err) {
		next(err);
	}
})

// delete a comment
router.delete('/:commentId/delete',auth, async (req, res, next) => {
	try {
		console.log("In delete a comment on a post");

		const commentId = req.params.commentId;
		const deletedComment = await Comment.findByIdAndDelete(commentId);

		if (!deletedComment) {
			return res.status(400).json({
				success: false,
				message: 'Comment not found',
				value: { }
			});
		}

		await Post.findByIdAndUpdate(
			deletedComment.postId,
			{ $pull: { commentsId: commentId} }
		)

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully!',
            value: { comment: _.pick(deletedComment, ['content', 'postId']) }
        });
	} catch(err) {
		next(err);
	}
})

// Add a comment
router.post('/:postId/add',auth, async (req, res, next) => {
	try {
		console.log("In add a comment on a post");

		const postId = req.params.postId;
		const { error, value } = validate(req.body);
		if (error) {
			return res.status(500).json({
				success: false,
				message: error.details[0].message,
				value: { }
			});
		}

		const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'Post not found',
                value: post
            });
        }

		const newComment = new Comment({
			postId: postId,
			content: value.content,
			commentedBy: req.user._id
		});

		await newComment.save();

		await Post.findByIdAndUpdate(postId, {
            $push: { commentsId: newComment._id }
        });

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully!',
            value: { comment: _.pick(newComment, ['content', 'postId']) }
        });
	} catch(err) {
		next(err);
	}
})

// get comments
router.get('/:postId', auth, async(req, res, next) => {
	try {
		console.log('In get all comments of a post from me');

		const postId = req.params.postId;

		const comments = await Comment.find({ postId: postId, commentedBy: req.user._id });

		if (comments.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'No comments made by you found on this post',
				value: comments
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Found your comments on the post',
			value: { comments: comments.map(comment => _.pick(comment, ['id', 'content']))}
		})
	} catch(err) {
		next(err);
	}
})

module.exports = router;