require('dotenv').config();
const config = require('config');
const mongoose = require('mongoose');

const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.database')}?authSource=admin`;

mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect:', err.message));

const authorSchema = new mongoose.Schema({
	name: {
		type: String
	},
	bio: {
		type: String
	},
	website: {
		type: String
	},
});

const courseSchema = new mongoose.Schema({
	name: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'authors'
	}
});

const Author = mongoose.model('authors', authorSchema);
const Course = mongoose.model('courses', courseSchema);

async function createAuthor(name, bio, website) {
	const author = new Author({
		name,
		bio,
		website
	});
	const result = await author.save();
	console.log(result);
}

async function createCourse(name, author) {
	const course = new Course({
		name,
		author
	});
	const result = await course.save();
	console.log(result);
}

async function listCourses() {
	const courses = await Course
	.find()
	.populate('author', 'name -_id')
	.sort('name author');
	console.log(courses);
}

// createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', '67cea73729b9be512340b11d')

listCourses();
