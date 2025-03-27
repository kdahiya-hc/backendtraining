require('dotenv').config();
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validatePost(data){
	const schema = Joi.object({
		userId: Joi.objectId().required(),
		content: Joi.string().required(),
		imageURL: Joi.string().optional(),
		likes: Joi.array().items(Joi.objectId()).optional,
		comments: Joi.array().items(Joi.objectId()).optional,
	});
	return schema.validate(data)
}

const postSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	content: { type: String, required: true },
	imageURL: { type: String },
  	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
  	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]},
	{ timestamps: true }
);

const Post = mongoose.model('post', postSchema);

module.exports = {Post, validatePost};