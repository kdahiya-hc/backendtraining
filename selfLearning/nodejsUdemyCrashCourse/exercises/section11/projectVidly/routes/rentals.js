const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/auth.js')
const { Rental, validateRental } = require('../models/rental.js');
const { Movie } = require('../models/movie.js');
const { Customer } = require('../models/customer.js');
const { default: mongoose } = require('mongoose');

// GET all rentals
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('dateOut');
  res.status(200).json(rentals);
});

// GET rental by ID
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('No rental found with the provided ID.');

  res.status(200).json(rental);
});

// POST create a rental, user sends only customerId and movieId
router.post('/', auth, async (req, res) => {
  const { error, value } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  const foundMovie = await Movie.findById(value.movieId).session(session);
  if (!foundMovie) {
    await session.abortTransaction();
    return res.status(400).send('No Movie with given ID');
  }

  const foundCustomer = await Customer.findById(value.customerId).session(session);
  if (!foundCustomer) {
    await session.abortTransaction();
    return res.status(400).send('No Customer with given ID');
  }

  if (foundMovie.numberInStock === 0) {
    await session.abortTransaction();
    return res.status(400).send('No Movies available to rent');
  }

  const newRental = new Rental({
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

  await newRental.save({ session });

  foundMovie.numberInStock--;
  await foundMovie.save({ session });

  await session.commitTransaction();
  res.status(201).json({ message: 'New rental has been added successfully!', rental: newRental });

  session.endSession(); // Ensure session is always ended
});

// PUT update a rental
router.put('/:id', auth, async (req, res) => {
  // Validate the request body
  const { error, value } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundMovie = await Movie.findById(value.movieId);
  if (!foundMovie) return res.status(400).send('Invalid Movie ID');

  const foundCustomer = await Customer.findById(value.customerId);
  if (!foundCustomer) return res.status(400).send('Invalid Customer ID');

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
});

// DELETE delete a rental
router.delete('/:id', auth, async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).send('No rental found with the provided ID.');

	const foundMovie = await Movie.findById(rental.movie._id);
	foundMovie.numberInStock++;
	await foundMovie.save();

  res.status(200).json(rental);
});

module.exports = router;
