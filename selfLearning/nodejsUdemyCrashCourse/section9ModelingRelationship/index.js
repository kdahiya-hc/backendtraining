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
	authors: [ authorSchema ],
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

async function createCourse(name, authors) {
	const course = new Course({
		name,
		authors
	});
	const result = await course.save();
	console.log(result);
}

async function listCourses() {
	const courses = await Course
	.find()
	.select('name authors.name')
	// console.log(courses);
	console.log(JSON.stringify(courses, null, 2));
}

// Updating the sub document using the parent

// Query First approach
async function updateAuthorQF(courseID) {
	try{
		const course = await Course.findById(courseID);
		if(!course) throw new Error('Course not found with provided ID');
		course.authors.name = 'Kishan Dahiya';
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
		await Course.updateOne({'_id': courseID }, { $set: { 'authors.name': 'Jay Bab'}});
		console.log('Author is updated');
	} catch(error) {
		console.log(error.message);
	}
}

// Remove with unset
async function removeAuthorElement(courseID) {
	try{
		await Course.updateOne({'_id': courseID }, { $unset: { 'authors': ''}});
		console.log('Author is deleted');
	} catch(error) {
		console.log(error.message);
	}
}

async function addAuthor(courseID, author) {
	const course = await Course.findById(courseID);
	course.authors.push(author);
	await course.save();
}

async function removeAuthor(courseID, authorID) {
	const course = await Course.findById(courseID);
	const author = course.authors.id(authorID);
	author.deleteOne();
	course.save();
}

// const courseID = '';
// const authorID = '';
// const newAuthor = new Author({ name: 'Zako', bio: 'I am in early 30s', website: 'www.zako30'});

// updateAuthorUF(courseID);

// updateAuthorUF(courseID);

// removeAuthor(courseID);

// addAuthor(courseID, newAuthor);

// removeAuthor(courseID, authorID);

// createCourse('Node Course', [
// 	new Author({name: 'Krupa', bio: 'I am Queen', website:'www.krupaQueen'}),
// 	new Author({name: 'Jay', bio: 'I am Jay SHAH!', website:'www.shajahn'}),
// 	new Author({name: 'Kishan', bio: 'I am Kishan', website:'www.kishan'}),
// ]);

listCourses();
