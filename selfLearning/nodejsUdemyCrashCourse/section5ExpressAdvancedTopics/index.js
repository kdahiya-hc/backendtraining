// Modules
const config = require('config');
const express = require('express');
const Joi = require('joi');
// Custom, third party  middle wares
const helmet = require('helmet');
const morgan = require('morgan');
// All routes, middleware files
const courses = require('./routes/courses');
const home = require('./routes/home');
const logger = require('./middleware/logger.js');
const authenticator = require('./middleware/authenticator.js');
// Debugging functions
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

// PORT
const PORT = process.env.PORT || 5005;

// Express application
const app = express();

// We tell express for any routes with below path, use that router
app.use('/api/courses', courses);
app.use('/', home);

// Setting templating engine
app.set('view engine', 'pug');
app.set('views', './views') // default templates here

// Static files served
app.use(express.static('public'));

// Middleware in request processing handler
// Built-in middlewares
app.use(express.json()); // parses to json to the req.body
app.use(express.urlencoded({extended: true})); // parses incoming key1=value1&key2=value2
// Custom Middleware function with next()
app.use(logger);
app.use(authenticator);
// Third-party middleware
app.use(helmet());

// Nodejs environment variable via standard variable and app
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

// Configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

// ( Shows database logs when you set an enviornment variable DEBUG=app:startup)
if ( process.env.NODE_ENV === 'development' ){
	app.use(morgan('dev'));
	startupDebugger('--------Morgan is enabled');
}

// Log for db work
// ( Shows database logs when you set an enviornment variable DEBUG=app:db)
dbDebugger('Started logging db');

// Listen on a port
app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
