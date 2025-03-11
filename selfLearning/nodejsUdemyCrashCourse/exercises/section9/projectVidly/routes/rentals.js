const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental.js');
const { Movie } = require('../models/movie.js');
const { Customer } = require('../models/customer.js');

// GET all rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().sort('dateOut');
    res.status(200).json(rentals);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error retrieving rentals');
  }
});

// GET rental by ID
router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('No rental found with the provided ID.');

    res.status(200).json(rental);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error retrieving the rental');
  }
});

// POST create a rental, user sends only customerId and movieId
router.post('/', async (req, res) => {
  // Validate the request body
  const { error, value } = validateRental(req);
  if (error) return res.status(400).send(error.details[0].message);

  const foundMovie = await Movie.findById(value.movieId);
  if (!foundMovie) return res.status(400).send('Invalid Movie');

  const foundCustomer = await Customer.findById(value.customerId);
  if (!foundCustomer) return res.status(400).send('Invalid Customer');

  if (foundMovie.numberInStock === 0) return res.status(400).send('No Movies available to rent');

  // Create and save the new rental
  try {
    let newRental = new Rental({
      customer: {
        _id: foundCustomer._id,
        name: foundCustomer.name,
      },
      movie: {
        _id: foundMovie._id,
        title: foundMovie.title,
      },
      dateReturned: null,
      rentalFee: foundMovie.dailyRentalRate
    });

    console.log(newRental);
    await newRental.save();

    foundMovie.numberInStock--;
    await foundMovie.save();

    res.status(201).send('New rental has been added successfully!');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error saving the rental');
  }
});

// PUT update a rental
router.put('/:id', async (req, res) => {
  // Validate the request body
  const { error, value } = validateRental(req);
  if (error) return res.status(400).send(error.details[0].message);

  const foundMovie = await Movie.findById(value.movieId);
  if (!foundMovie) return res.status(400).send('Invalid Movie ID');

  const foundCustomer = await Customer.findById(value.customerId);
  if (!foundCustomer) return res.status(400).send('Invalid Customer ID');

  // Update the rental
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          customer: {
            _id: foundCustomer._id,
            name: foundCustomer.name,
          },
          movie: {
            _id: foundMovie._id,
            title: foundMovie.title,
          }
        }
      },
      { new: true }
    );

    if (!rental) return res.status(404).send('No rental found with the provided ID.');

    res.status(200).send('The rental has been updated successfully.');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error updating the rental');
  }
});

// DELETE delete a rental
router.delete('/:id', async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send('No rental found with the provided ID.');

    res.status(200).json(rental);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error deleting the rental');
  }
});

module.exports = router;
