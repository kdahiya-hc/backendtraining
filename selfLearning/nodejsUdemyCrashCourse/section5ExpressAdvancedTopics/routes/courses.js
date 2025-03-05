const express = require('express');
const router = express.Router();

// Static course
const courses = [
	{ id:1, name:'MCA' },
	{ id:2, name:'BCA' },
]

router.get('/', (req, res) => {
	res.status(200).send(courses);
});

router.get('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course){res.status(404).send('The course with the given ID is not found!!!');}
	res.send(course);
});

router.post('/', (req, res) => {
	const value = validateCourse(req, res);
	const newCourse = {
		id: courses.length + 1,
		name: value.name,
	};

	courses.push(newCourse);
	res.status(201).json(newCourse);
});

router.put('/:id', (req, res) => {
	// Look up
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if ( !course ) { return res.status(404).send('Course not found!!!'); }

	// Validate name (repeated)
	const value = validateCourse(req, res)

	// Update data
	course.name = value.name;
	res.status(200).send(course);
});

router.delete('/:id', (req, res) => {
	// Look up
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if ( !course ) { return res.status(404).send('Course not found!!!'); }

	// Delete data
	const index = courses.indexOf(course);
	courses.splice(index, 1)
	res.send(course);
});

module.exports = router;
