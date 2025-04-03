// /routes/comment.js
const _ = require('lodash');
const { Post } = require('../models/Post');
const { Comment, validateComment: validate } = require('../models/Comment');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router({ mergeParams: true }); // This merge params is getting :postId

/**
 * @swagger
 * /api/comments/{commentId}/update:
 *   patch:
 *     tags:
 *       - comments
 *     summary:
 *       Update a comment
 *     description: |
 *       This end point will update a comment if it is owned by authenticated user.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The 24 hexadecimal characters Id of comment
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     requestBody:
 *       description: Needs valid comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/comment"
 *     responses:
 *       200:
 *         description: Success in updating the comment
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
 *       403:
 *         description: It is not your comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/forbiddenResponse"
 *       404:
 *         description: Comment not found
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

// update a comment
router.patch('/:commentId/update', auth, async (req, res, next) => {
    try {
        console.log("In update a comment on a post");

        const { error, value } = validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                value: {}
            });
        }

        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
                value: {}
            });
        }

        if (comment.commentedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only update your own comments',
                value: {}
            });
        }

        comment.content = value.content;
        await comment.save();

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully!',
            value: { comment: _.pick(comment, ['content', 'postId']) }
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/comments/{commentId}/delete:
 *   delete:
 *     tags:
 *       - comments
 *     summary:
 *       delete a comment
 *     description: |
 *       This end point will delete a comment if it is owned by authenticated user.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The 24 hexadecimal characters Id of comment
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     responses:
 *       200:
 *         description: Success in deleting the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       403:
 *         description: It is not your comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/forbiddenResponse"
 *       404:
 *         description: Comment not found
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

// delete a comment
router.delete('/:commentId/delete', auth, async (req, res, next) => {
    try {
        console.log("In delete a comment on a post");

        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
                value: {}
            });
        }

        // Ensure only the comment owner can delete it
        if (comment.commentedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only delete your own comments',
                value: {}
            });
        }

        await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(comment.postId, { $pull: { commentsId: commentId } });

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully!',
            value: { comment: _.pick(comment, ['content', 'postId']) }
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/comments/{postId}/add:
 *   post:
 *     tags:
 *       - comments
 *     summary:
 *       Add a comment
 *     description: |
 *       This end point will Add a comment to a post.
 *     security:
 *       - authToken: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The 24 hexadecimal characters Id of post
 *         schema:
 *           $ref: "#/components/schemas/objectId"
 *     requestBody:
 *       description: Needs valid comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/comment"
 *     responses:
 *       201:
 *         description: Success in adding the comment
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
 *       404:
 *         description: Post not found
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

// Add a comment
router.post('/:postId/add', auth, async (req, res, next) => {
	try {
		console.log("In add a comment on a post");

        const postId = req.params.postId;
        const { error, value } = validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                value: {}
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
                value: {}
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
            value: { comment: _.pick(newComment, ['_id', 'content', 'postId']) }
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     tags:
 *       - comments
 *     summary: Get all the comments of a post
 *     description: |
 *       This end point shall get all the comments of a post.
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
 *         description: Success in getting the comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// get comments
router.get('/:postId', auth, async(req, res, next) => {
	try {
		console.log('In get all comments of a post from me');

		const postId = req.params.postId;

		const comments = await Comment.find({ postId: postId });

		if (comments.length === 0) {
			return res.status(200).json({
				success: true,
				message: 'No comments on this post',
				value: comments
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Found all comments on the post',
			value: { comments: comments.map(comment => _.pick(comment, ['id', 'content', 'commentedBy']))}
		})
	} catch(err) {
		next(err);
	}
})

module.exports = router;