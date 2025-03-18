const express = require('express');
const app = express();

const logger = require('./startup/logger.js');
require('./startup/routes.js')(app);
require('./startup/db.js')();
require('./startup/config.js')();
require('./startup/validation.js')();

// Use express middleware for both JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine and views folder setup (if you're using Pug)
app.set('view engine', 'pug');
app.set('views', './views');

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});