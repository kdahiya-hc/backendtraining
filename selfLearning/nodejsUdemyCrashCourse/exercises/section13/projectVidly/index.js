const express = require('express');
const app = express();

const logger = require('./startup/logger.js');
require('./startup/routes.js')(app);
require('./startup/db.js')();
require('./startup/config.js')();
require('./startup/validation.js')();

// Start the server
const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});

module.exports = server;