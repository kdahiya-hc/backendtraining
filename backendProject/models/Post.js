// /models/Post.js
const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     post:
 *       description: A post made by user
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the post
 *         imageURL:
 *           type: string
 *           description: The URL of the attachement
 *           format: uri
 *           default: ''
 *         likesCount:
 *           type: integer
 *           description: The count of likes to the post
 *           default: 0
 *         commentsId:
 *           type: array
 *           description: Array of comment IDs
 *           items:
 *             type: string
 *             description: 24-hex-decimal comment ID
 *             pattern: "^[a-fA-F0-9]{24}$"
 *         postedBy:
 *           type: string
 *           description: 24 hex-decimal user ID
 *           pattern: "^[a-fA-F0-9]{24}$"
 *       required:
 *         - content
 *       example:
 *         content: "This is my example post"
 *         imageURL: "https://example.com/image.jpg"
 *         likesCount: 999999
 *         commentsId: ["aAbB1234cCdD5678eEfF9090", "aAbB1234cCdD5678eEfF9090"]
 *         postedBy: aAbB1234cCdD5678eEfF9090
 */

const postSchema = new mongoose.Schema({
	content: { type: String, required: true },
	imageURL: { type: String, default: ''},
  	likesCount: { type: Number, default: 0 },
  	commentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] }],
	postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	}, { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

function validatePost(data){
	const schema = Joi.object({
		content: Joi.string().required(),
		imageURL: Joi.string().optional(),
		likesCount: Joi.number().optional(),
		commentsId: Joi.array().items(Joi.objectId()).optional(),
		postedBy: Joi.objectId().optional(),
	}).options({ stripUnknown: true });;
	return schema.validate(data)
}

module.exports = { Post, validatePost };