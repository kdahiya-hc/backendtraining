require('dotenv').config();
const config = require('config');

require('express-async-errors');
const express = require('express');

const mongoose = require('mongoose');

const PORT = config.get('port');

const dbConfig = config.get('db');
const database = process.env[dbConfig.database]

const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${database}?authSource=admin`;

mongoose.connect(dbUri)
	.then(() => console.log(`Connected to ${dbUri}`))
	.catch(err => console.log(err));

const app = express();

app.use('/', require('./routes/home'));

// Server
app.listen(config.get('port'), () => {
	console.log(`Listening on http://${config.get('host')}:${PORT}`)
})