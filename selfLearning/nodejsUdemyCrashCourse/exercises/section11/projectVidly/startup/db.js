require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');
const { logger } = require("./logger");
const mongoose = require('mongoose');

const db = () => {
	// MongoDB connection
	const dbUri = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.atlasHost')}/${config.get('db.database')}?retryWrites=true&w=majority`;

	mongoose.connect(dbUri)
		.then(() => console.log('Connected to MongoDB...'))
		.catch(err => {
			logger.info('Could not connect to MongoDB:', err.message);
		});
}

module.exports = db;