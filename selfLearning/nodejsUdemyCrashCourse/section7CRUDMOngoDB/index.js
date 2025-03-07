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
	date: {type: Date, default: Date.now },
	isPublished: Boolean,
});

// Model create , populate with documents
// Class as first letter Caps Pascal case
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
	// Object , camel case
	const course = new Course({
		name: 'Angular Course',
		author: 'kdahiya-hc',
		tags: ['angula', 'frontend'],
		isPublished: true,
	});

	// document is ready next save to collection
	const result = await course.save();
	console.log(result);
}

async function getCourse() {
	const courses = await Course
	.find({ author: 'kdahiya-hc'})
	.limit(10)
	.sort({ name: 1})
	.select({name: 1, tags: 1})
	console.log(courses);
}

// createCourse();

getCourse();
