// logger.js
require('dotenv').config();
const config = require('config');
require('winston-mongodb');
const winston = require('winston');

const dbUri = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.atlasHost')}/${config.get('db.database')}?retryWrites=true&w=majority`;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Sends to console , any level of error
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // Sends and writes to file logfile, since no path is used it is created in root
        new winston.transports.File({
            format: winston.format.json(),
            filename: 'logfile.log',
            level: 'error'
        }),
        // Sends and writes to MongoDB
        new winston.transports.MongoDB({
            db: dbUri,
            collection: 'logs',
            level: 'error',
        }),
    ],
});

module.exports.logger = logger;
