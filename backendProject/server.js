require('dotenv').config();
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

// database configuration
const dbConfig = config.get('db');
const database = process.env[dbConfig.database]

const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${database}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log(`Connected to ${database}`))
	.catch(err => console.log(err));

// express application initialization
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
app.use('/', require('./routes/home'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/friends/', require('./routes/friend'));
app.use('/api/friends/requests', require('./routes/friendRequest'));

// server configuration
const PORT = config.get('port');
app.listen(config.get('port'), () => {
	console.log(`Listening on http://${config.get('host')}:${PORT}`)
})