require('dotenv').config();
const config = require('config');
const express = require('express');
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const home = require('./routes/home');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 5005;

const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:27017,${config.get('db.host')}:27018,${config.get('db.host')}:27019/${config.get('db.database')}?authSource=admin&replicaSet=rs0`;

mongoose.connect(dbUri)
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect:',err.message));

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/', home);

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
