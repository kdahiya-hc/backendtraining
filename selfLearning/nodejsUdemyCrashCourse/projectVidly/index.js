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
	{'name':'action'},
	{'name':'horror'},
	{'name':'comedy'},
	{'name':'romance'},
	{'name':'drama'},
	{'name':'thriller'},
	{'name':'western'},
	{'name':'sci-fi'},
];

// Function to validate genre name
function validateGenreName(req, res){
	const schema = Joi.object({
		name: Joi.string.min(4).required(),
	});
	const {error, value} = schema.validate(req.body);
	if (error){ return res.status(400).send(error.details[0].message); }
	return value;
};

// Home or default route
app.get('/', (req, res) => {
	res.status(200).send('<h1>Home Page<h1>');
});

// GET all genre
app.get('/api/genres', (req, res) => {
	res.status(200).send(genres);
})

// POST create a genre

// PUT update a genre

// DELETE delete a genre

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
