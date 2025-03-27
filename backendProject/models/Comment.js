const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
	postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	},{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(data){
	const schema = Joi.object({
		postId: Joi.objectId().required(),
		userId: Joi.objectId().optional(),
		content: Joi.string().required(),
	}).options({ stripUnknown: true });

	return schema.validate(data);
}

module.exports = { Comment, validateComment };