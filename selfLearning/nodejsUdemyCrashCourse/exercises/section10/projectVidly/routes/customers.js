const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/auth.js');
const {Customer, validateCustomer} = require('../models/customer.js');

// GET all customers
router.get('/', async (req, res) => {
	try {
		const customers = await Customer.find().sort('name');
		res.status(200).json(customers);
	} catch (err) {
		res.status(500).send({ message: 'Error retrieving customers', error: err.message});
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
		res.status(500).send({ message: 'Error retrieving the customer', error: err.message});
	}
});

// POST create a customer
router.post('/', auth, async (req, res) => {
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
		res.status(500).send({ message: 'Error saving the customer', error: err.message});
	}
});

// PUT update a customer
router.put('/:id', auth, async (req, res) => {
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
		res.status(500).send({ message: 'Error updating the customer', error: err.message});
	}
});

// DELETE delete a customer
router.delete('/:id', auth, async (req, res) => {
	try {
		const customer = await Customer.findByIdAndDelete(req.params.id);
		if (!customer) {
			return res.status(404).send('No customer found with provided ID.');
		}

		res.status(200).json(customer);
	} catch (err) {
		res.status(500).send({ message: 'Error deleting the customer', error: err.message});
	}
});

module.exports = router;
