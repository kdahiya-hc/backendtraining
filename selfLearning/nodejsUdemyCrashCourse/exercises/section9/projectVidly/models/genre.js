const Joi = require('joi');
const mongoose = require('mongoose');

// Define the genre schema
const genreSchema = new mongoose.Schema({
	typeOfGenre: {
		type: String,
		validate: {
			validator: function(value) {
				return new Promise((resolve, reject) => {
					if (value && value.length >= 4) {
						resolve(true);
					} else {
						reject(new Error('The genre type should be at least 4 characters.'));
					}
				});
			}
		},
	},
});

// Create a Genre model
const Genre = mongoose.model('genres', genreSchema);

// Validate genre input using Joi
function validateGenreType(req) {
	const schema = Joi.object({
		typeOfGenre: Joi.string().min(4).required(),
	});
	return schema.validate(req.body);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateGenreType = validateGenreType;
