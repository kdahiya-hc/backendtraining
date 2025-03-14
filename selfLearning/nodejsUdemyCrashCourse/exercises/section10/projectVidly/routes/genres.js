const express = require('express');
const {auth} = require('../middlewares/auth')
const router = express.Router();
const {Genre, validateGenreType} = require('../models/genre.js');

// GET all genres
router.get('/', async (req, res) => {
	try {
		const genres = await Genre.find().sort('typeOfGenre');
		res.status(200).json(genres);
	} catch (err) {
		res.status(500).send('Error retrieving genres');
	}
});

// GET genre by ID
router.get('/:id', async (req, res) => {
	try {
		const genre = await Genre.findById(req.params.id);
		if (!genre) {
			return res.status(404).send('No genre found with provided ID.');
		}

		res.status(200).json(genre);
	} catch (err) {
		res.status(500).send('Error retrieving the genre');
	}
});

// POST create a genre
router.post('/', auth, async (req, res) => {
	// Validate the request body
	const { error, value } = validateGenreType(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Create and save the new genre
	try {
		const newGenre = new Genre({
			typeOfGenre: value.typeOfGenre,
		});
		await newGenre.save();
		res.status(201).json({ message: 'New genre has been added successfully!', genre: newGenre });
	} catch (err) {
		res.status(500).send('Error saving the genre');
	}
});

// PUT update a genre
router.put('/:id', async (req, res) => {
	// Validate the request body
	const { error, value } = validateGenreType(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const genre = await Genre.findByIdAndUpdate(
			req.params.id,
			{ $set: {
				typeOfGenre: value.typeOfGenre
				} },
			{ new: true }
		);
		if (!genre) {
			return res.status(404).send('No genre found with provided ID.');
		}

		res.status(200).send('The type of genre for provided ID has been updated successfully.');
	} catch (err) {
		res.status(500).send('Error updating the genre');
	}
});

// DELETE delete a genre
router.delete('/:id', async (req, res) => {
	try {
		const genre = await Genre.findByIdAndDelete(req.params.id);
		if (!genre) {
			return res.status(404).send('No genre found with provided ID.');
		}

		res.status(200).json(genre);
	} catch (err) {
		res.status(500).send('Error deleting the genre');
	}
});

module.exports = router;
