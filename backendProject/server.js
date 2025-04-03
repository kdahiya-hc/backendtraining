// server.js
require('dotenv').config();
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const { error } = require('./middlewares/error.js');
// You can either define the Swagger documentation inline using JSDoc comments,
// or load the documentation from an external JSON or YAML file. Here it is swagger.yaml file
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const YAML = require('yamljs');
// const swaggerDocument = require('./swagger-output.json');
const swaggerDocument = YAML.load('./swagger.yaml');

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   xAuthToken:
 *    type: apiKey
 *    in: header
 *    name: x-auth-token
 *  schemas:
 *   baseResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *     message:
 *      type: string
 *     value:
 *      type: object
 *   successResponse:
 *    allOf:
 *     - $ref: "#/components/schemas/baseResponse"
 *    example:
 *     success: true
 *     message: Passed
 *     value: { key: value }
 *   failureResponse:
 *    allOf:
 *     - $ref: "#/components/schemas/baseResponse"
 *    example:
 *     success: false
 *     message: Failed
 *     value: { }
 *   errorResponse:
 *    allOf:
 *    - $ref: "#/components/schemas/baseResponse"
 *    example:
 *     success: false
 *     message: Error mesage
 *     value: {  }
 *   unauthorizedResponse:
 *    allOf:
 *     - $ref: "#/components/schemas/baseResponse"
 *    example:
 *     success: false
 *     message: access denied
 *     value: { }
 *   badRequestResponse:
 *    allOf:
 *     - $ref: "#/components/schemas/baseResponse"
 *    example:
 *     success: false
 *     message: Bad Request
 *     value: { }
 *   notFoundResponse:
 *    allOf:
 *     - $ref: "#/components/schemas/baseResponse"
 *    example:
 *     success: false
 *     message: Not found
 *     value: { }
 */

// Swagger configuration: Set up Swagger UI with OpenAPI specs for API documentation
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Social Media API',
			version: '1.0.0',
			description: '\n\nThis is from JsDoc comment based application of swagger documentation.\n\nThis is the social media api created based on the backend training project document.\n\nSome useful links: \n\n - [The Backend training repository(public)](https://github.com/kdahiya-hc/backendtraining)',
		},
		servers: [
			{
				url: 'http://localhost:8000',
				description: 'Development environment'
			},
		],
	},
	// This below line tells where to read the paths or components from. Read API docs from route and model files
	apis: ['./middlewares/*.js', './*.js', './routes/*.js', './models/*.js']
}

// Initialize swaggerJSDoc, specs is used to build the ui
const specs = swaggerJsDoc(options);

// express application initialization
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serving the Swagger UI at the '/api-docs' route to visualize the API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/', require('./routes/home'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/friends/requests', require('./routes/friendRequest'));
app.use('/api/friends', require('./routes/friend'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/likes/:postId', require('./routes/like'));
app.use('/api/comments', require('./routes/comment'));
app.use(error);

// Database configuration
const dbConfig = config.get('db');
const database = process.env[dbConfig.database];

const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${database}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log(`Connected to ${database}`))
	.catch(err => {
		console.log(err);
		process.exit(1);
	});

// server configuration
const PORT = config.get('port');
app.listen(config.get('port'), () => {
	console.log(`Listening on http://${config.get('host')}:${PORT}`)
})