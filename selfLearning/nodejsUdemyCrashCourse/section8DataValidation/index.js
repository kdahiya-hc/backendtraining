// Import necessary libraries
require('dotenv').config();
const config = require('config');
const mongoose = require('mongoose');

// Build MongoDB connection string from config file
const dbUri = `mongodb://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}:27017,${config.get('db.host')}:27018,${config.get('db.host')}:27019/${config.get('db.database')}?authSource=admin&replicaSet=rs0`;

// Connect to MongoDB database
mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB')) // Success message on successful connection
  .catch(err => console.log('Could not connect:', err.message)); // Error handling if connection fails

// Define the schema for courses
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5 }, // Name field must be a string with a minimum length of 5 characters
  author: String, // Author field (optional)
  tags: {
    type: Array, // Tags should be an array
    validate: {
      // Asynchronous validation using Promises for tags
      validator: function(value) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const result = value && value.length > 0; // Tags must have at least one value
            if (result) {
              resolve(true);
            } else {
              reject(new Error('A course should have at least one tag!')); // Error message for no tags
            }
          }, 4000); // Simulate a 4-second delay for validation
        });
      },
      message: 'A course should have at least one tag!' // Default validation message
    }
  },
  price: { type: Number, min: 50, max: 50000, required: function() { return this.isPublished; } }, // Price is required if the course is published
  date: { type: Date, default: Date.now }, // Default date is the current date
  isPublished: Boolean, // Whether the course is published or not
});

// Define the Course model using the schema
const Course = mongoose.model('courses', courseSchema);

// POST: Create a new course
async function createCourse() {
  const course = new Course({
    name: 2, // Invalid name (should be a string and length >= 5)
    author: 'kdahiya-hc',
    tags: null, // Invalid tags (tags should be an array with at least one element)
    price: 1000,
    isPublished: true,
  });

  try {
    // Validate the course before saving it
    await course.validate(); // Mongoose validation
    const result = await course.save(); // Save the course to the database
    console.log("Course saved:", result);
  } catch (err) {
    // Handle validation errors and log each error message
    for (field in err.errors) {
      console.log(err.errors[field].message);
    }
  }
}

// GET: Retrieve courses with pagination, sorting, and limiting the number of courses
async function getCourse() {
  const pageNumber = 3; // Page number for pagination
  const pageSize = 10; // Number of courses per page
  const courses = await Course
    .find() // Find all courses
    .skip((pageNumber - 1) * pageSize) // Skip the courses from previous pages
    .limit(pageSize) // Limit the number of results to pageSize
    .sort({ name: 1 }); // Sort courses alphabetically by name
  console.log(courses); // Output the courses to the console
}

// Query First: Find the course first, then update it
async function updateAuthorQF(id) {
  const course = await Course.findById(id); // Find course by ID
  if (!course) {
    console.log('Course not found');
    return;
  }

  course.set({
    name: 'Jayshah' // Update the course name
  });
  const result = await course.save(); // Save the updated course
  console.log(result); // Output the updated course
}

// Update First: Find the course and update it in a single step
async function updateAuthorUF(id) {
  const course = await Course.findByIdAndUpdate(
    { _id: id }, // Find course by ID
    { $set: { // Update fields
      author: 'Mosh',
      isPublished: true
    }},
    { new: true } // Return the updated course
  );

  console.log(course); // Output the updated course
}

// Remove a field (e.g., 'name') from the course using $unset
async function removeAuthor(id) {
  const course = await Course.findById(id); // Find course by ID
  if (!course) {
    console.log('Course not found');
    return;
  }

  // Removing the 'name' field using $unset
  const result = await Course.updateOne(
    { _id: id }, // Find the document by _id
    { $unset: { name: "" } } // Remove the 'name' field
  );

  console.log(result); // Output the result of the update
}

// Remove a course from the database using deleteOne
async function removeCourse(id) {
  const course = await Course.findById(id); // Find course by ID
  if (!course) {
    console.log('Course not found');
    return;
  }

  // Removing the course from the database
  const result = await Course.deleteOne(
    { _id: id } // Find the course by _id
  );

  console.log(result); // Output the result of the deletion
}

// Example usage of each method (uncomment to test)
// updateAuthorQF('67caac43c30a39af7c08b7f6'); // Update course using query-first method
// updateAuthorUF('67caac43c30a39af7c08b7f6'); // Update course using update-first method
// removeCourse('67caac43c30a39af7c08b7f9'); // Remove a course from the database
createCourse(); // Create a new course (with validation error)
// getCourse(); // Retrieve courses with pagination and sorting
