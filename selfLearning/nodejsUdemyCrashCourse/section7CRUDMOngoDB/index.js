require('dotenv').config(); // ✅ Load environment variables at the top
const config = require('config');
const mongoose = require('mongoose');

const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.database')}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log('Could not connect:',err.message))
