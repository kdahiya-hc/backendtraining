require('dotenv').config();
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

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
	const course = new Course({
		name: 'Advanced Nodejs Course',
		author: 'kdahiya-hc',
		tags: ['nodejs', 'backend'],
		price: 1000,
		isPublished: true,
	});

	const result = await course.save();
	console.log(result);
}

async function getCourse() {
	const pageNumber = 3;
	const pageSize = 10;
	const courses = await Course
	.find()
	// .skip((pageNumber -1) * pageSize)
	// .limit(pageSize)
	.sort({ name: 1})
	console.log(courses);
}

async function updateCourse(id) {
	const course = await Course.findById(id)
	if (!course) {
		console.log('Course not found');
		return;
	}

	course.isPublished = true;
	course.author = 'KJay';

	const result = await course.save();
	console.log(result);
}

updateCourse('5a68fdc3615eda645bc6bdec');

// createCourse();

// getCourse();
