const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre.js');
Joi.objectId = require('joi-objectid')(Joi);

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
		max: 5000
	},
})

// Create Moview Model
const Movie = mongoose.model('Movies', movieSchema);

// Validate movie using Joi, returns { error , value }
function validateMovie(req) {
	const schema = Joi.object({
		title: Joi.string().min(0).max(50).required(),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().min(0).max(255).required(),
		dailyRentalRate: Joi.number().min(0).max(5000).required(),
	});
	return schema.validate(req.body);
}

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.validateMovie = validateMovie;
