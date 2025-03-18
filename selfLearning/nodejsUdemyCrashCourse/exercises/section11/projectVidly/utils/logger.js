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
            level: 'error' // Logs only error-level logs here
        }),
        // Transport to log errors to MongoDB
        new winston.transports.MongoDB({
            db: dbUri,
            collection: 'logs',
            level: 'error', // Logs only error-level logs to MongoDB
        }),
    ],
    exceptionHandlers: [
        // Transport for uncaught exceptions (will log to console)
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // Transport for uncaught exceptions (will log to a file)
        new winston.transports.File({
            format: winston.format.json(),
            filename: 'uncaughtExceptions.log',
        }),
        // Optional: Transport for uncaught exceptions (MongoDB)
        new winston.transports.MongoDB({
            db: dbUri,
            collection: 'uncaughtExceptions',
        }),
    ],
    rejectionHandlers: [
        // Transport for unhandled promise rejections (will log to console)
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // Transport for unhandled promise rejections (will log to a file)
        new winston.transports.File({
            format: winston.format.json(),
            filename: 'unhandledRejections.log',
        }),
        // Optional: Transport for unhandled promise rejections (MongoDB)
        new winston.transports.MongoDB({
            db: dbUri,
            collection: 'unhandledRejections',
        }),
    ],
});

// Handle uncaught exceptions globally using Winston's `handleExceptions`
winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

// Handle unhandled promise rejections globally using Winston's `handleRejections`
winston.handleRejections(
    new winston.transports.File({ filename: 'unhandledRejections.log' })
);

module.exports.logger = logger;
