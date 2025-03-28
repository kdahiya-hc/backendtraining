// /models/Post.js
const mongoose = require('mongoose');
const Joi = require('joi');

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