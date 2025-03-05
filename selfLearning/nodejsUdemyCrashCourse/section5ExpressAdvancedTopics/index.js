const express = require('express');
const logger = require('./logger.js')
const authenticator = require('./authenticator.js')
const PORT = process.env.PORT || 5005;

const app = express();

// Middleware in request processing handler
app.use(express.json());
// Custom Middleware function with next()
app.use(logger);
app.use(authenticator);

app.get('/', (req, res) => {
	res.status(200).send('Hi');
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
