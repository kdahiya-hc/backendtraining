const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Static object which shall be for genres
const genres = [
	{ id:1, 'typeOfGenre':'action'},
	{ id:2, 'typeOfGenre':'horror'},
	{ id:3, 'typeOfGenre':'comedy'},
	{ id:4, 'typeOfGenre':'romance'},
	{ id:5, 'typeOfGenre':'drama'},
	{ id:6, 'typeOfGenre':'thriller'},
	{ id:7, 'typeOfGenre':'western'},
	{ id:8, 'typeOfGenre':'sci-fi'},
];

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
router.get('/', (req, res) => {
	res.status(200).json(genres);
})

// GET genre by id
router.get('/:id', (req, res) => {
	// Use find() an array function which also calls a fucntion that returns
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }
	res.status(200).json(genre);
});

// GET genre by typeOfGenre
router.get('/:typeOfGenre', (req, res) => {
	// Use find() an array function which also calls a fucntion that returns
	const genre = genres.find( x => x.typeOfGenre === req.params.typeOfGenre);
	if (!genre) { return res.status(404).send('No genre found with the provided type'); }
	res.status(200).json(genre);
});

// POST create a genre
router.post('/', (req, res) => {
	// Validate
	const {error, value} = validateGenreType(req, res);
	if (error) return res.status(400).send(error.details[0].message);

	// Create
	const newGenre = {
		id: genres.length+1,
		typeOfGenre: value.typeOfGenre,
	}

	genres.push(newGenre);

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
