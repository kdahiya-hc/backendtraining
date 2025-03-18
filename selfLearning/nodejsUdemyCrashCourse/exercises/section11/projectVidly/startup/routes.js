// Import routes
const express = require('express');
const movies = require('../routes/movies.js')
const genres = require('../routes/genres.js');
const users = require('../routes/users.js');
const auth = require('../routes/auth.js');
const customers = require('../routes/customers.js');
const rentals = require('../routes/rentals.js');
const home = require('../routes/home.js');
const { error } = require('../middlewares/error.js');

const routes = (app)=> {
	// Use express middleware for both JSON and URL-encoded data
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// View engine and views folder setup (if you're using Pug)
	app.set('view engine', 'pug');
	app.set('views', './views');

	// Register all the routes
	app.use('/api/genres', genres);
	app.use('/api/users', users);
	app.use('/api/customers', customers);
	app.use('/api/movies', movies);
	app.use('/api/rentals', rentals);
	app.use('/api/auth', auth);
	app.use('/', home);
	app.use(error);
}

module.exports = routes;