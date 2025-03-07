// Modules
const express = require('express');
// Joi is a class
const Joi = require('joi');

// Initialize express??
const app = express();

// Initialize

// Middleware
app.use(express.json());

// Set PORT fron env variables
const PORT = process.env.PORT || 5005;

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

// Function to validate genre typeOfGenre
function validateGenreType(req, res){
	const schema = Joi.object({
		typeOfGenre: Joi.string().min(4).required(),
	});
	const {error, value} = schema.validate(req.body);
	if (error){ return res.status(400).send(error.details[0].message); }
	return value;
};

function findGenreById(id){
	return genres.find(c => c.id === parseInt(id));
}

// Home or default route
app.get('/', (req, res) => {
	res.status(200).send('<h1>Home Page<h1>');
});

// GET all genre
app.get('/api/genres', (req, res) => {
	res.status(200).json(genres);
})

// GET genre by id
app.get('/api/genres/:id', (req, res) => {
	// Use find() an array function which also calls a fucntion that returns
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }
	res.status(200).json(genre);
});

// GET genre by typeOfGenre
app.get('/api/genres/:typeOfGenre', (req, res) => {
	// Use find() an array function which also calls a fucntion that returns
	const genre = genres.find( x => x.typeOfGenre === req.params.typeOfGenre);
	if (!genre) { return res.status(404).send('No genre found with the provided type'); }
	res.status(200).json(genre);
});

// POST create a genre
app.post('/api/genres', (req, res) => {
	// Validate
	const value = validateGenreType(req, res);

	// Create
	const newGenre = {
		id: genres.length+1,
		typeOfGenre: value.typeOfGenre,
	}

	genres.push(newGenre);

	// Reply 201 when created newly
	res.status(201).send('New genre has been added succesfully!')
});

// PUT update a genre
app.put('/api/genres/:id', (req, res) => {
	// Find
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }

	// Validate
	const value = validateGenreType(req, res);

	// Update
	genre.typeOfGenre = value.typeOfGenre;

	// Reply 200 when done or success
	res.status(200).send('The type of genre for provided ID has been updated succesfully.');
});

// DELETE delete a genre
app.delete('/api/genres/:id', (req, res) => {
	// Find
	const genre = findGenreById(req.params.id);
	if (!genre) { return res.status(404).send('No genre found with provided ID.'); }

	// Delete
	const index = genres.indexOf(genre);
	genres.splice(index, 1)
	res.status(200).json(genre);

	// Reply
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
