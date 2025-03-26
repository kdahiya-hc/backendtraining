require('dotenv').config();
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const dbConfig = config.get('db');
const database = process.env[dbConfig.database]

const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${database}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log(`Connected to ${dbUri}`))
	.catch(err => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/', require('./routes/home'));
app.use('/api/users', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));

const PORT = config.get('port');

// Server
app.listen(config.get('port'), () => {
	console.log(`Listening on http://${config.get('host')}:${PORT}`)
})