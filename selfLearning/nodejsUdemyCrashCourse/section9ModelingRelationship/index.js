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
	author: authorSchema,
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

// Updating the sub document using the parent

// Query First approach
async function updateAuthorQF(courseID) {
	try{
		const course = await Course.findById(courseID);
		if(!course) throw new Error('Course not found with provided ID');
		course.author.name = 'Kishan Dahiya';
		await course.save()
		console.log('Author is updated');
	} catch(error) {
		console.log(error.message);
	}
}

// Update First approach
// use set to update
async function updateAuthorUF(courseID) {
	try{
		await Course.updateOne({'_id': courseID }, { $set: { 'author.name': 'Jay Bab'}});
		console.log('Author is updated');
	} catch(error) {
		console.log(error.message);
	}
}

// Remove with unset
async function removeAuthor(courseID) {
	try{
		await Course.updateOne({'_id': courseID }, { $unset: { 'author': ''}});
		console.log('Author is deleted');
	} catch(error) {
		console.log(error.message);
	}
}

// updateAuthorUF('');
// updateAuthorUF('67cf836692083654d311fa97');
removeAuthor('67cf836692083654d311fa97');
// createCourse('Node Course', new Author({name: 'Kishan', bio: 'I am Kishan', website:'www.kishan'}));

// listCourses();
