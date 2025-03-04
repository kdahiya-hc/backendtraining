const express = require('express');

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
	if (!course){res.status(404).send('The course with the given ID is not found!!!')};
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	// const newCourse = req.body;
	// if (!newCourse.id || !newCourse.name){
	// 	return res.status(404).send('Course Name and id are both required');
	// }
	if (!req.body.name){
		return res.status(404).send('Course Name is required');
	}

	const newCourse = {
		id: courses.length + 1,
		name: req.body.name
	};

	courses.push(newCourse);
	res.status(201).json(newCourse);
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`)
})
