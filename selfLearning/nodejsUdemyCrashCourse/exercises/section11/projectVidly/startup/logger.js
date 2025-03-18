require('dotenv').config();
const config = require('config');
require('winston-mongodb');
const winston = require('winston');

// Database connection URI for MongoDB
const dbUri = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.atlasHost')}/${config.get('db.database')}?retryWrites=true&w=majority`;

// Create the logger with transports
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // General transport to log to the console
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // Transport to log to a file (logs everything, errors and other logs)
        new winston.transports.File({
            format: winston.format.json(),
            filename: 'logfile.log',
            level: 'error'
        }),
        // Transport to log errors to MongoDB
        new winston.transports.MongoDB({
            db: dbUri,
            collection: 'logs',
            level: 'error',
        }),
    ],
});

// Global error handling: Log uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    throw err;
});

process.on('unhandledRejection', (err) => {
    throw err;
});

// Handle uncaught exceptions and unhandled promise rejections
winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

winston.rejections.handle(
    new winston.transports.File({ filename: 'unhandledRejections.log' })
);

module.exports = logger;
