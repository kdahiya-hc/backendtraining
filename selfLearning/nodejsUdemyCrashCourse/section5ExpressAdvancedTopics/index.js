const config = require('config');
require('dotenv').config()
const express = require('express');
const logger = require('./logger.js');
const Joi = require('joi');
const authenticator = require('./authenticator.js');
const helmet = require('helmet');
const morgan = require('morgan');

// Debugging functions
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

// PORT
const PORT = process.env.PORT || 5005;

// Express application
const app = express();

// Set view or templating engine. Express loads internally
app.set('view engine', 'pug');
// Only to override templates of the engine above/ optional
app.set('views', './views') // default and all templates should be there

// Nodejs environment variable via standard variable and app
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

// Configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

// Middleware in request processing handler
// Built-in middlewares
app.use(express.json()); // parses to json to the req.body
app.use(express.urlencoded({extended: true})); // parses incoming key1=value1&key2=value2
app.use(express.static('public'));

// Custom Middleware function with next()
app.use(logger);
app.use(authenticator);

// Third-party middleware
app.use(helmet());

// Log
// ( Shows database logs when you set an enviornment variable DEBUG=app:startup)
if ( process.env.NODE_ENV === 'development' ){
	app.use(morgan('dev'));
	startupDebugger('--------Morgan is enabled');
}

// Log for db work
// ( Shows database logs when you set an enviornment variable DEBUG=app:db)
dbDebugger('Started logging db');

// Static course
const courses = [
	{ id:1, name:'MCA' },
	{ id:2, name:'BCA' },
]
app.get('/', (req, res) => {
	res.status(200)
	.render(
		'index',{
		title:'My Express Example',
		message: "Hi",
	});
});

app.get('/api/courses', (req, res) => {
	res.status(200).send(courses);
});

app.post('/api/courses', (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	});
	const {error, value} = schema.validate(req.body);
	if (error) { return res.status(400).send(error.details[0].message); }
	const newCourse = {
		id: courses.length+1,
		name: value.name,
	}

	courses.push(newCourse);
	res.status(201).json(newCourse);
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
