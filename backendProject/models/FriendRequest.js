const mongoose = require('mongoose');
const Joi = require('joi');

const friendRequestSchema = new mongoose.Schema({
	senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	message: { type: String, default: 'Can you be my friend?' },
	status: { type: String, enum: ['pending', 'declined', 'accepted'], default: 'pending' },
	},{
		timestamps: true,
	});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

function validateFriendRequest(data){
	const schema = Joi.object({
		senderId: Joi.objectId().optional(),
		receiverId: Joi.objectId().required(),
		message: Joi.string().optional(),
		status: Joi.string().valid('pending', 'declined', 'accepted').optional(),
	}).options({ stripUnknown: true });

	return schema.validate(data);
}

module.exports = { FriendRequest, validateFriendRequest };