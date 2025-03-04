// Modules
const express = require('express');
// Joi is a class
const Joi = require('joi');

// Initialize express??
const app = express();

// Middleware
app.use(express.json());

// Set PORT fron env variables
const PORT = process.env.PORT || 5005;

// Static object which shall be for genres

app.get('/', (req, res) => {
	res.status(200).send('<h1>Home Page<h1>');
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
