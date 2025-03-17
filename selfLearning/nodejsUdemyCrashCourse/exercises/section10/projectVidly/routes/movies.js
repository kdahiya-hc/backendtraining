const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie.js');
const { Genre } = require('../models/genre');
const {auth} = require('../middlewares/auth.js');

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort('title');
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving movies', error: err.message});
  }
});

// GET movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send('No movie found with the provided ID.');
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving the movie', error: err.message});
  }
});

// POST create a movie
router.post('/', auth, async (req, res) => {
  // Validate the request body
  const { error, value } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundGenre = await Genre.findById(req.body.genreId);
  if (!foundGenre) { return res.status(400).send('Invalid genre.'); }

  // Create and save the new movie
  try {
    const newMovie = new Movie({
      title: value.title,
      genre: {
        // Since this is entering all the properties at creation it is embedded, with passing actual schema and fine
        _id: foundGenre._id,
        typeOfGenre: foundGenre.typeOfGenre,
      },
      numberInStock: value.numberInStock,
      dailyRentalRate: value.dailyRentalRate,
    });
    console.log(newMovie);
    await newMovie.save();
    res.status(201).json({ message: 'New movie has been added successfully!', movie: newMovie });
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: 'Error saving the movie', error: err.message});
  }
});

// PUT update a movie
router.put('/:id', auth, async (req, res) => {
  // Validate the request body
  const { error, value } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundGenre = await Genre.findById(req.body.genreId);
  if (!foundGenre) { return res.status(400).send('Invalid genre.'); }

  // Update the movie
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: value.title,
          genre: {
            _id: foundGenre.id,
            name: foundGenre.name,
          },
          numberInStock: value.numberInStock,
          dailyRentalRate: value.dailyRentalRate,
        }
      },
      { new: true }
    );
    if (!movie) {
      return res.status(404).send('No movie found with the provided ID.');
    }

    res.status(200).send('The movie has been updated successfully.');
  } catch (err) {
    res.status(500).send({ message: 'Error updating the movie', error: err.message});
  }
});

// DELETE delete a movie
router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).send('No movie found with the provided ID.');
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).send({ message: 'Error deleting the movie', error: err.message});
  }
});

module.exports = router;
