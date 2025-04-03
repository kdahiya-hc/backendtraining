// swaggerAutoGen.js
const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

// Specify the output file and the routes to be included
const outputFile = path.join(__dirname, 'swagger-output.json');
const routes = [
  path.join(__dirname, 'routes', 'auth.js'),
  path.join(__dirname, 'routes', 'comment.js'),
  path.join(__dirname, 'routes', 'friend.js'),
  path.join(__dirname, 'routes', 'friendRequest.js'),
  path.join(__dirname, 'routes', 'home.js'),
  path.join(__dirname, 'routes', 'like.js'),
  path.join(__dirname, 'routes', 'post.js'),
  path.join(__dirname, 'routes', 'user.js'),
];

// Automatically generate the Swagger doc
swaggerAutogen(outputFile, routes).then(() => {
});
