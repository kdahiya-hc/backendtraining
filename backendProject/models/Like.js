// /models/Like.js
const mongoose = require('mongoose');
const Joi = require('joi');

const likeSchema = new mongoose.Schema({
	postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
	likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},{ timestamps: true });

const Comment = mongoose.model('Like', likeSchema);

function validateLike(data){
	const schema = Joi.object({
		postId: Joi.objectId().required(),
		likedBy: Joi.objectId().optional(),
	}).options({ stripUnknown: true });

	return schema.validate(data);
}

module.exports = { Comment, validateLike };