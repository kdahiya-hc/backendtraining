// server.js
require('dotenv').config();
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
// Either do the swagger documentation in code and load or
// do the swagger documentation in a json or yaml file and load it.
const swaggerJsDoc = require('swagger-jsdoc');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');

// database configuration
const dbConfig = config.get('db');
const database = process.env[dbConfig.database];

const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${database}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log(`Connected to ${database}`))
	.catch(err => console.log(err));

// swagger configuration
const options = {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Social Media API',
				description: 'This is the social media api created based on the backend training project document.\n\nSome useful links: \n\n - [The Backend training repository](https://github.com/swagger-api/swagger-petstore)',
				version: '1.0.0',
			},
			servers: [
				{
					url: 'http://localhost:8000',
					description: 'Development environment'
				},
			],
		},
		apis: [ './routes/*.js', './models/*.js']
		// Read API docs from route and model files
	}

const specs = swaggerJsDoc(options);

// express application initialization
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV));

// serve the swagger ui
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// routes
app.use('/', require('./routes/home'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/friends/requests', require('./routes/friendRequest'));
app.use('/api/friends', require('./routes/friend'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/likes/:postId', require('./routes/like'));
app.use('/api/comments', require('./routes/comment'));

// server configuration
const PORT = config.get('port');
app.listen(config.get('port'), () => {
	console.log(`Listening on http://${config.get('host')}:${PORT}`)
})