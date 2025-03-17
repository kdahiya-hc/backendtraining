const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/auth.js');
const {Customer, validateCustomer} = require('../models/customer.js');

// GET all customers
router.get('/', async (req, res, next) => {
	try {
		const customers = await Customer.find().sort('name');
		res.status(200).json(customers);
	} catch (err) {
		err.custom = 'Error retrieving customers';
		next(err);
	}
});

// GET customer by ID
router.get('/:id', async (req, res, next) => {
	try {
		const customer = await Customer.findById(req.params.id);
		if (!customer) {
			return res.status(404).send('No customer found with provided ID.');
		}

		res.status(200).json(customer);
	} catch (err) {
		err.custom = 'Error retrieving the customer';
		next(err);	}
});

// POST create a customer
router.post('/', auth, async (req, res, next) => {
	// Validate the request body
	const { error, value } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Create and save the new customer
	try {
		const newCustomer = new Customer({
			name: value.name,
			phone: value.phone,
			isGold: value.isGold,
		});
		console.log(newCustomer);
		await newCustomer.save();
		res.status(201).json({ message: 'New customer has been added successfully!', customer: newCustomer });
	} catch (err) {
		err.custom = 'Error saving the customer';
		next(err);	}
});

// PUT update a customer
router.put('/:id', auth, async (req, res, next) => {
	// Validate the request body
	const { error, value } = validateCustomer(req.body);
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
		err.custom = 'Error updating the customer';
		next(err);	}
});

// DELETE delete a customer
router.delete('/:id', auth, async (req, res, next) => {
	try {
		const customer = await Customer.findByIdAndDelete(req.params.id);
		if (!customer) {
			return res.status(404).send('No customer found with provided ID.');
		}

		res.status(200).json(customer);
	} catch (err) {
		err.custom = 'Error deleting the customer';
		next(err);
	}
});

module.exports = router;
