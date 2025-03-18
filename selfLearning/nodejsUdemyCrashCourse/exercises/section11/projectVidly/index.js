require('express-async-errors'); // Required to handle async errors in routes without try-catch
require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');
const express = require('express');

// Check if JWT key is present in environment variables
const jwtPrivateKey = process.env.JWT_SECRET || config.get('jwtPrivateKey');
if (!jwtPrivateKey) {
    console.error('JWT Secret key is missing!');
    process.exit(1);
}

// Initialize Express app
const app = express();

require('./startup/logger.js');
require('./startup/routes.js')(app);
require('./startup/db.js')();
require('./startup/config.js')();

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

// Use express middleware for both JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine and views folder setup (if you're using Pug)
app.set('view engine', 'pug');
app.set('views', './views');

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
