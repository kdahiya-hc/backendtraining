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
 *           $ref: "#/components/schemas/objectId"
 *         commentedBy:
 *           $ref: "#/components/schemas/objectId"
 *       required:
 *         - content
 *       example:
 *         content: Hey that is my picture, give credits!
 *         postId: aAbB1234cCdD5678eEfF9090
 *         commentedBy: aAbB1234cCdD5678eEfF9090
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