// server.js
const app = require('./app.js');
const logger = require('./startup/logger.js');

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});

module.exports = server;
