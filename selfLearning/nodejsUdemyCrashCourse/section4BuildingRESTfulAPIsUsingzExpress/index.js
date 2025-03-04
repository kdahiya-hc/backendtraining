const express = require('express');

const PORT = 5005;

const app = express();

app.get('/', (req, res) => {
	res.send('Hello');
});

app.get('/api/courses', (req, res) => {
	res.send(["Java","Express","Node"]);
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`)
})
