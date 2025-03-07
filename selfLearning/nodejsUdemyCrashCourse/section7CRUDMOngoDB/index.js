require('dotenv').config(); // ✅ Load environment variables at the top
const config = require('config');
const mongoose = require('mongoose');

const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.database')}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log('Could not connect:',err.message));

// Define schema
const courseSchema = new mongoose.Schema({
	name: String,
	author: String,
	tags: [String ],
	price: Number,
	date: {type: Date, default: Date.now },
	isPublished: Boolean,
});

// Model create , populate with documents
// Class as first letter Caps Pascal case
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
	// Object , camel case
	const course = new Course({
		name: 'Advanced Nodejs Course',
		author: 'kdahiya-hc',
		tags: ['nodejs', 'backend'],
		price: 1000,
		isPublished: true,
	});

	// document is ready next save to collection
	const result = await course.save();
	console.log(result);
}

async function getCourse() {
	// Comparision operators
	// gt = greater than
	// gte = greater than or equal to
	// eq = equal
	// ne = not equal
	// lt = less than
	// lte = less than or equal to
	// in = in
	// nin = not in

	// Logical Operators
	// or = and
	// and = and

	// Regular expression
	// /<pattern>/ = holds pattern
	// /^<pattern>/ = starts with pattern
	// /<pattern>$/ = ends with pattern
	// /<pattern>/i = case insensitive
	// /.*<pattern>.*/ = Containts 0 or more characters before and after pattern

	const pageNumber = 2;
	const pageSize = 2;
	// /api/course?pageNumber=2&pageSize=10
	const courses = await Course
	.find({ author: /.*dahiya.*/i})
	.skip((pageNumber -1) * pageSize)
	.limit(pageSize)
	.sort({ name: 1})
	console.log(courses);
}

// createCourse();

getCourse();
