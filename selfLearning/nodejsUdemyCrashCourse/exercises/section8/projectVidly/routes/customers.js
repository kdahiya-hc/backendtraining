const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

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

// Validate customer input using Joi
function validateGenreType(req) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		phone: Joi.number().min(1000000000).required(),
		isGold: Joi.boolean().required(),
	});
	return schema.validate(req.body);
}

// GET all customers
router.get('/', async (req, res) => {
	try {
		const customers = await Customer.find().sort('name');
		res.status(200).json(customers);
	} catch (err) {
		res.status(500).send('Error retrieving customers');
	}
});

// GET customer by ID
router.get('/:id', async (req, res) => {
	try {
		const customer = await Customer.findById(req.params.id);
		if (!customer) {
			return res.status(404).send('No customer found with provided ID.');
		}

		res.status(200).json(customer);
	} catch (err) {
		res.status(500).send('Error retrieving the customer');
	}
});

// POST create a customer
router.post('/', async (req, res) => {
	// Validate the request body
	const { error, value } = validateGenreType(req);
	if (error) return res.status(400).send(error.details[0].message);

	// Create and save the new customer
	try {
		let newCustomer = new Customer({
			name: value.name,
			phone: value.phone,
			isGold: value.isGold,
		});
		console.log(newCustomer);
		await newCustomer.save();
		res.status(201).send('New customer has been added successfully!');
	} catch (err) {
		res.status(500).send('Error saving the customer');
	}
});

// PUT update a customer
router.put('/:id', async (req, res) => {
	// Validate the request body
	const { error, value } = validateGenreType(req);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const customer = await Customer.findByIdAndUpdate(
			req.params.id,
			{ $set: value },
			{ new: true }
		);
		if (!customer) {
			return res.status(404).send('No customer found with provided ID.');
		}

		res.status(200).send('The type of customer for provided ID has been updated successfully.');
	} catch (err) {
		res.status(500).send('Error updating the customer');
	}
});

// DELETE delete a customer
router.delete('/:id', async (req, res) => {
	try {
		const customer = await Customer.findByIdAndDelete(req.params.id);
		if (!customer) {
			return res.status(404).send('No customer found with provided ID.');
		}

		res.status(200).json(customer);
	} catch (err) {
		res.status(500).send('Error deleting the customer');
	}
});

module.exports = router;
