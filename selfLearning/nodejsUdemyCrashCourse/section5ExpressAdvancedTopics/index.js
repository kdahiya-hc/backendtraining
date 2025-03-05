const express = require('express');
const logger = require('./logger.js');
const Joi = require('joi');
const authenticator = require('./authenticator.js');
const helmet = require('helmet');
const morgan = require('morgan');

// PORT
const PORT = process.env.PORT || 5005;

// Express application
const app = express();

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
app.use(morgan('dev'))

const courses = [
	{ id:1, name:'MCA' },
	{ id:2, name:'BCA' },
]
app.get('/', (req, res) => {
	res.status(200).send('Hi');
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
