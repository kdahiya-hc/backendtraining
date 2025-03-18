// logger.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'logfile.log' })
    ],
});

module.exports.logger = logger;
