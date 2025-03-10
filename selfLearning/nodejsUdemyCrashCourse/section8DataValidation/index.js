require('dotenv').config();
const config = require('config');
const mongoose = require('mongoose');

const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.database')}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log('Could not connect:',err.message));

// Define schema
const courseSchema = new mongoose.Schema({
	name: {type: String, nirequired: true},
	author: String,
	tags: {
		type: Array,
		validate: {
			validator: function(value){
				return value && value.length > 0;
			},
			message: 'A course should have one tage at least!',
		},
	},
	price: {type: Number,min: 50, max: 50000, required: function() { return this.isPublished;}},
	date: {type: Date, default: Date.now },
	isPublished: Boolean,
});

const Course = mongoose.model('courses', courseSchema);

async function createCourse() {
	const course = new Course({
		name: 'Advanced Nodejs Course',
		author: 'kdahiya-hc',
		// tags: ['nodejs', 'backend'],
		price: 1000,
		isPublished: true,
	});
	try{
		await course.validate()
		const result = await course.save();
		console.log("Course saved:",result);
	}catch(exception){
		console.log(exception.message);
	}
}

async function getCourse() {
	const pageNumber = 3;
	const pageSize = 10;
	const courses = await Course
	.find()
	.skip((pageNumber -1) * pageSize)
	.limit(pageSize)
	.sort({ name: 1})
	console.log(courses);
}

// Query First
async function updateAuthorQF(id) {
	const course = await Course.findById(id)
	if (!course) {
		console.log('Course not found');
		return;
	}

	course.set({
		name:'Jayshah'
	})
	const result = await course.save();
	console.log(result);
}

// Update First
async function updateAuthorUF(id) {
	const course = await Course.findByIdAndUpdate(
		{ _id : id },
		{ $set : {
			author: 'Mosh',
			isPublished: true
		}},
		{ new: true }
	);

	console.log(course);
}

async function removeAuthor(id) {
	const course = await Course.findById(id);
	if (!course) {
	  console.log('Course not found');
	  return;
	}

	// Removing the 'name' field using $unset
	const result = await Course.updateOne(
	  { _id: id }, // Find the document by _id
	  { $unset: {
		name: ""
	} }
	);

	console.log(result);
  }

async function removeCourse(id) {
const course = await Course.findById(id);
if (!course) {
	console.log('Course not found');
	return;
}

// Removing the 'name' field using $unset
const result = await Course.deleteOne(
	{ _id: id }
);

console.log(result);
}

// updateAuthorQF('67caac43c30a39af7c08b7f6');

// updateAuthorUF('67caac43c30a39af7c08b7f6');

// removeCourse('67caac43c30a39af7c08b7f9');

createCourse();

// getCourse();
