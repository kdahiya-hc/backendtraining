require('express-async-errors');
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
    // if not wanting to define below , can define the exception and rejection handlers here too
    // exceptionHandlers: [],
    // rejectionHandlers: [],
});

// Handle uncaught exceptions (synchronous errors)
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', { message: err.message, stack: err.stack });
    process.exit(1);  // Exit the process after logging the error
  });

  // Handle unhandled promise rejections (asynchronous errors)
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);  // Exit the process after logging the error
  });

// Handle uncaught exceptions and unhandled promise rejections
logger.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    // new winston.transports.Console({
    //     format: winston.format.combine(
    //         winston.format.colorize(),
    //         winston.format.simple()
    //     ),
    // })
);

logger.rejections.handle(
    new winston.transports.File({ filename: 'unhandledRejections.log' }),
    // new winston.transports.Console({
    //     format: winston.format.combine(
    //         winston.format.colorize(),
    //         winston.format.simple()
    //     ),
    // })
);

module.exports = logger;
