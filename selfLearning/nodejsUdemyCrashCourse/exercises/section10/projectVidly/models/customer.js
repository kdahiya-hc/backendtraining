const Joi = require('joi');
const mongoose = require('mongoose');

// Validate customer input using Joi
function validateCustomer(data) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		phone: Joi.number().min(1000000000).required(),
		isGold: Joi.boolean().required(),
	}).options({ stripUnknown: true });
	return schema.validate(data);
}

// Define the customer schema
const customerSchema = new mongoose.Schema({
	name: {type: String,
		required: true,
		validate: {
			validator: function(value) {
			  return new Promise((resolve, reject) => {
				if (!isNaN(value)) {
				  reject(new Error('Name cannot be a number.'));
				} else if (typeof value === 'string' && value.length >= 2) {
				  resolve(true);
				} else {
				  reject(new Error('Name must be a string with at least 4 characters.'));
				}
			  });
			},
		},
	},
	phone: {
		type: Number,
		required: true,
		validate:{
			validator: function(value){
				return new Promise((resolve, reject) => {
					if(value && value > 1000000000){
						resolve(true);
					}else{
						reject(new Error('Phone No. needs to be atleast 10 digits'))
					}
				})
			}
		},
	},
	isGold: {type: Boolean, required: true},
});

// Create a Customer model
const Customer = mongoose.model('customers', customerSchema);

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validateCustomer = validateCustomer;
