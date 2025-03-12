const mongoose = require('mongoose');

const dbUri = `mongodb://admin:june1999@localhost:27017,localhost:27018,localhost:27019/exercise?authSource=admin&replicaSet=rs0`;

mongoose.connect(dbUri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Could not connect:',err.message));

// Schema for Object
const courseSchema = mongoose.Schema({
	name: String,
	author: String,
	tags: [String],
	price: Number,
	date: {type: Date, default: Date.now },
	isPublished: Boolean,
})
// Model or Class
const Course = mongoose.model('Course',courseSchema);

// Document in Collection
async function getCourses() {
	const courses = await Course
	.find({isPublished: true, tags:'backend'})
	.sort({name: 1})
	.select({name: 1, author: 1})
	console.log(courses);
}

getCourses();
