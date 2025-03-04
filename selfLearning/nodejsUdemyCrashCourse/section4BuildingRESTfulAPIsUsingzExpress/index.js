const express = require('express');
const Joi = require('joi');

const PORT = process.env.PORT || 5005;

const app = express();

//Middleware in request processing handler
app.use(express.json());

const courses = [
	{id: 1, name: "Java"},
	{id: 2, name: "Node"},
	{id: 3, name: "Express"},
	{id: 4, name: "Python"},
];

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course){res.status(404).send('The course with the given ID is not found!!!');}
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(4).required(),
	});

	const {error, value} = schema.validate(req.body);
	if (error){ return res.status(400).send(error.details[0].message); }
	const newCourse = {
		id: courses.length + 1,
		name: value.name,
	};

	courses.push(newCourse);
	res.status(201).json(newCourse);
});

app.put('/api/courses/:id', (req, res) => {
	// Look up
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if ( !course ) { return res.status(404).send('Course not found!!!'); }

	const schema = Joi.object({
		name: Joi.string().min(4).required(),
	});

	// Validate name (repeated)
	const {error, value} = schema.validate(req.body);
	if (error){ return res.status(400).send(error.details[0].message); }

	// Update data
	course.name = value.name;
	res.status(200).send(course);
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
