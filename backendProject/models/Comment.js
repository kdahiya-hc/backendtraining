const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
	content: { type: String, required: true },
	postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
	commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(data){
	const schema = Joi.object({
		content: Joi.string().required(),
		postId: Joi.objectId().required(),
		commentedBy: Joi.objectId().optional(),
	}).options({ stripUnknown: true });

	return schema.validate(data);
}

module.exports = { Comment, validateComment };