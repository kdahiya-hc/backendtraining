require('express-async-errors'); // Required to handle async errors in routes without try-catch
require('dotenv').config(); // Loads environment variables from .env file
const config = require('config');
const express = require('express');

// Initialize Express app
const app = express();

require('./startup/logger.js');
require('./startup/routes.js')(app);
require('./startup/db.js')();
require('./startup/config.js')();

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
