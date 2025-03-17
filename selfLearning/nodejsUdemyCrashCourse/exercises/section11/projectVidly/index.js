require('dotenv').config();
const config = require('config');
const {error} = require('./middlewares/error.js')
const express = require('express');
const movies = require('./routes/movies.js');
const genres = require('./routes/genres.js');
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');
const customers = require('./routes/customers.js');
const rentals = require('./routes/rentals.js');
const home = require('./routes/home.js');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 5005;

const dbUri = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.atlasHost')}/${config.get('db.database')}?retryWrites=true&w=majority`;

mongoose.connect(dbUri)
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect:',err.message));

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/auth', auth);
// the next in any route goes to error handling middle ware because it was used in the last
app.use(error)

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', home);

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
