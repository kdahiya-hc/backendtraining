const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/auth.js');
const asyncHandler = require('../middlewares/async.js')
const {Customer, validateCustomer} = require('../models/customer.js');

// GET all customers
router.get('/', asyncHandler( async (req, res) => {
	const customers = await Customer.find().sort('name');
	res.status(200).json(customers);
}));

// GET customer by ID
router.get('/:id', asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params.id);
	if (!customer) {
		return res.status(404).send('No customer found with provided ID.');
	}

	res.status(200).json(customer);
}));

// POST create a customer
router.post('/', auth, asyncHandler(async (req, res) => {
	// Validate the request body
	const { error, value } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const newCustomer = new Customer({
		name: value.name,
		phone: value.phone,
		isGold: value.isGold,
	});
	console.log(newCustomer);
	await newCustomer.save();
	res.status(201).json({ message: 'New customer has been added successfully!', customer: newCustomer });
}));

// PUT update a customer
router.put('/:id', auth, asyncHandler(async (req, res) => {
	// Validate the request body
	const { error, value } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findByIdAndUpdate(
		req.params.id,
		{ $set: value },
		{ new: true }
	);
	if (!customer) {
		return res.status(404).send('No customer found with provided ID.');
	}

	res.status(200).send('The type of customer for provided ID has been updated successfully.');
}));

// DELETE delete a customer
router.delete('/:id', auth, asyncHandler( async (req, res, next) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);
	if (!customer) {
		return res.status(404).send('No customer found with provided ID.');
	}

	res.status(200).json(customer);
}));

module.exports = router;
