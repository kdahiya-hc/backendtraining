const express = require('express');
const genres = require('./routes/genres.js');
const home = require('./routes/home');

const app = express();

const PORT = process.env.PORT || 5005;

app.use(express.json());

app.use('/api/genres', genres);
app.use('/', home);

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
