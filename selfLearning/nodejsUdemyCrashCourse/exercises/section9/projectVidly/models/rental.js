const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
	// customer
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				trim: true,
			}
		}),
		required: true,
	},
	// movie
	movie: {
		type: new mongoose.Schema({
			title: {
				type: String,
				required: true,
				trim: true,
			}
		}),
		required: true,
	},
	// dateout
	dateOut: {
		type: Date,
		default: Date.now,
	},
	// datereturned
	dateReturned: {
		type: Date,
	},
	// rentalFee
	rentalFee:{
		type: Number,
		min: 0,
	},
})

const Rental = mongoose.model('rentals', rentalSchema);

// Validate movie using Joi, returns { error , value }
function validateRental(req) {
	const schema = Joi.object({
		movieId: Joi.string().max(50).required(),
		customerId: Joi.string().required(),
	});
	return schema.validate(req.body);
}

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.validateRental = validateRental;
