require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');

// Check if JWT key is present in environment variables
module.exports = function () {
	if (!config.get('jwtPrivateKey')) {
		throw new Error('Jwt secret key is missing');
	}
}