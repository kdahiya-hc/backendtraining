const Joi = require('joi');
const mongoose = require('mongoose');
const genreSchema = require('./genre.js');

// Movie Schema
const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength:0,
		maxlength:255,
		trim: true,
	},
	genre: {
		type: genreSchema,
		required: true,
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	},
})

// Create Moview Model
const Movie = mongoose.Model('Movies', movieSchema);

// Validate movie using Joi, returns { error , value }
function validateMovie(req) {
	const schema = Joi.object({
		title: Joi.string().min(0).max(255).trim().required(),
		genre: Joi.string().min(4).required(),
		numberInStock: Joi.string().min(0).max(255).trim().required(),
		dailyRentalRate: Joi.string().min(0).max(255).trim().required(),
	});
	return schema.validate(req.body);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
