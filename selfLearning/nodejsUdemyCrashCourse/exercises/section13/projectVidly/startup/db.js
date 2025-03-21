require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');
const mongoose = require('mongoose');
const logger = require('./logger');

const db = () => {
	// MongoDB connection to Atlas
	const dbConfig = config.get('db');
	const dbUri = `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.atlasHost}/${dbConfig.database}?retryWrites=true&w=majority&appName=Cluster0`;

	mongoose.connect(dbUri)
		.then(() => logger.info(`Connected to ${process.env.NODE_ENV} MongoDB...`))
}

module.exports = db;