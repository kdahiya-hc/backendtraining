require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');
const mongoose = require('mongoose');
const logger = require('./logger');

const db = () => {
	// MongoDB connection
	const dbUri = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.atlasHost')}/${config.get('db.database')}?retryWrites=true&w=majority`;

	mongoose.connect(dbUri)
		.then(() => logger.info('Connected to MongoDB...'))
}

module.exports = db;