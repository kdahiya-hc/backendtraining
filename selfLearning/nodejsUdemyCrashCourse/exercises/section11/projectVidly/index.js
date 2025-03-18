require('express-async-errors'); // Required to handle async errors in routes without try-catch
require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Check if JWT key is present in environment variables
const jwtPrivateKey = process.env.JWT_SECRET || config.get('jwtPrivateKey');
if (!jwtPrivateKey) {
    console.error('JWT Secret key is missing!');
    process.exit(1);
}

// Import routes
const movies = require('./routes/movies.js');
const genres = require('./routes/genres.js');
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');
const customers = require('./routes/customers.js');
const rentals = require('./routes/rentals.js');
const home = require('./routes/home.js');

// Import error-handling middleware and logger
const { error } = require('./middlewares/error.js');
const { logger } = require('./utils/logger.js');

// Initialize Express app
const app = express();

// Global error handling: Log uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    logger.error(err.message, err);
    // Optionally exit the process with a non-zero code:
    // process.exit(1); // Uncomment if you want to exit the process
});

process.on('unhandledRejection', (err) => {
    logger.error(err.message, err);
    // Optionally exit the process with a non-zero code:
    // process.exit(1); // Uncomment if you want to exit the process
});

// MongoDB connection
const dbUri = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.atlasHost')}/${config.get('db.database')}?retryWrites=true&w=majority`;

mongoose.connect(dbUri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => {
        console.error('Could not connect to MongoDB:', err.message);
        // Log to file and MongoDB if connection fails
        logger.error('MongoDB connection failed:', err.message);
    });

// Use bodyParser middleware for both JSON and URL-encoded data
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); 

// Register all the routes
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/auth', auth);

// Error-handling middleware (always place this last)
app.use(error);

// View engine and views folder setup (if you're using Pug)
app.set('view engine', 'pug');
app.set('views', './views');

// Home route
app.use('/', home);

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
