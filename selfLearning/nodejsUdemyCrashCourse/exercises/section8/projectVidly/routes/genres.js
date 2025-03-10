const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
	typeOfGenre:{
		type: String,
		validate: {
			validator: function(value) {
				return new Promise((resolve, reject) => {
					if (value && value.length>4){
						resolve(true);
					}else{
						reject(new Error('The genre type should be atleast 4 characters.'));
					}
				});
			}
		},
	},
})

const Genre = mongoose.model('genres', genreSchema);

function findGenreById(id){
	return genres.find(c => c.id === parseInt(id));
}

function validateGenreType(req, res){
	const schema = Joi.object({
		typeOfGenre: Joi.string().min(4).required(),
	});
	return schema.validate(req.body);
};

// GET all genre
router.get('/', async (req, res) => {
	const genres = await Genre.find().sort('typeOfGenre');
	res.status(200).json(genres);
})

// GET genre by id
router.get('/:id', (req, res) => {
	// Use find() an array function which also calls a fucntion that returns
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }
	res.status(200).json(genre);
});

// POST create a genre
router.post('/', async (req, res) => {
	// Validate
	const {error, value} = validateGenreType(req, res);
	if (error) return res.status(400).send(error.details[0].message);

	// Create
	const newGenre = new Genre({
		typeOfGenre: value.typeOfGenre,
	});
	await newGenre.save();

	// Reply 201 when created newly
	res.status(201).send('New genre has been added succesfully!');
});

// PUT update a genre
router.put('/:id', (req, res) => {
	// Find
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }

	// Validate
	const {error, value} = validateGenreType(req, res);
	if (error) return res.status(400).send(error.details[0].message);
	// Update
	genre.typeOfGenre = value.typeOfGenre;

	// Reply 200 when done or success
	res.status(200).send('The type of genre for provided ID has been updated succesfully.');
});

// DELETE delete a genre
router.delete('/:id', (req, res) => {
	// Find
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }

	// Delete
	const index = genres.indexOf(genre);
	genres.splice(index, 1)

	// Reply
	res.status(200).json(genre);
});

module.exports = router;
