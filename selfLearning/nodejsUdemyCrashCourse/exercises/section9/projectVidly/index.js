require('dotenv').config();
const config = require('config');
const express = require('express');
const movies = require('./routes/movies.js');
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const rentals = require('./routes/rentals.js');
const home = require('./routes/home');
const mongoose = require('mongoose');
// const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 5005;

const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.database')}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect:',err.message));

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', home);

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
