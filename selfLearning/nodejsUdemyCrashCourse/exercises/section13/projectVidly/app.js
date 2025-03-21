// index.js
const express = require('express');
const app = express();

const logger = require('./startup/logger.js');
require('./startup/routes.js')(app);
require('./startup/db.js')();
require('./startup/config.js')();
require('./startup/validation.js')();

// Export the app, not the server
module.exports = app;
