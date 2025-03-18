// Import routes
const movies = require('../routes/movies.js')
const genres = require('../routes/genres.js');
const users = require('../routes/users.js');
const auth = require('../routes/auth.js');
const customers = require('../routes/customers.js');
const rentals = require('../routes/rentals.js');
const home = require('../routes/home.js');

// Import error-handling middleware and logger
const { error } = require('../middlewares/error.js');

const routes = (app)=> {
	// Register all the routes
	app.use('/api/genres', genres);
	app.use('/api/users', users);
	app.use('/api/customers', customers);
	app.use('/api/movies', movies);
	app.use('/api/rentals', rentals);
	app.use('/api/auth', auth);

	// Error-handling middleware (always place this last)
	app.use(error);

	// Home route
	app.use('/', home);
}

module.exports = routes;