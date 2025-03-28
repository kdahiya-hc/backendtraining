// /models/FriendRequest.js
const mongoose = require('mongoose');
const Joi = require('joi');

const friendRequestSchema = new mongoose.Schema({
	message: { type: String, default: 'Can you be my friend?' },
	status: { type: String, enum: ['pending', 'declined', 'accepted'], default: 'pending' },
	from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	},{
		timestamps: true,
	});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

function validateFriendRequest(data){
	const schema = Joi.object({
		message: Joi.string().optional(),
		status: Joi.string().valid('pending', 'declined', 'accepted').optional(),
		from: Joi.objectId().optional(),
		to: Joi.objectId().required(),
	}).options({ stripUnknown: true });

	return schema.validate(data);
}

module.exports = { FriendRequest, validateFriendRequest };