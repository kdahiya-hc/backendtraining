const express = require('express');
const router = express.Router();
const {Customer, validateCustomer} = require('../models/customer');

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
	const { error, value } = validateCustomer(req);
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
	const { error, value } = validateCustomer(req);
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
