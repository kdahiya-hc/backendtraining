require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');

// Check if JWT key is present in environment variables
module.exports = function () {
	const jwtPrivateKey = process.env.JWT_SECRET || config.get('jwtPrivateKey');
	if (!jwtPrivateKey) {
		throw new Error('Jwt secret key is missing');
	}
}