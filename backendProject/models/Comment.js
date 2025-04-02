// /models/Comment.js
const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     comment:
 *       description: Comment under a post
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *         postId:
 *           type: string
 *           description: 24 hex decimals or 12 bytes id of post
 *         commentedBy:
 *           type: string
 *           description: 24 hex decimals or 12 bytes id of user
 *       required:
 *         - content
 *       additionalProperties: false
 *       example:
 *         content: Hey that is my picture, give credits!
 *         postId: aAbB1234cCdD5678
 *         commentedBy: aAbB1234cCdD5678
*/

const commentSchema = new mongoose.Schema({
	content: { type: String, required: true },
	postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
	commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(data){
	const schema = Joi.object({
		content: Joi.string().required(),
		postId: Joi.objectId().optional(),
		commentedBy: Joi.objectId().optional(),
	}).options({ stripUnknown: true });

	return schema.validate(data);
}

module.exports = { Comment, validateComment };