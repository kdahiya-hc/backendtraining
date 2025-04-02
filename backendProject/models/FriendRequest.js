// /models/FriendRequest.js
const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     friendRequest:
 *       description: A friend request
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The message along with the request
 *           default: Can you be my friend?
 *         status:
 *           type: string
 *           description: The status of the request
 *           default: pending
 *           enum:
 *             - pending
 *             - declined
 *             - accepted
 *         from:
 *           type: string
 *           description: 24 hex decimals or 12 bytes id of sender
 *         to:
 *           type: string
 *           description: 24 hex decimals or 12 bytes id of receiver
 *       required:
 *         - to
 *       additionalProperties: false
 *       example:
 *         message: Can you be my friend?
 *         status: pending
 *         from: aAbB1234cCdD5678
 *         to: aAbB1234cCdD5678
 */

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