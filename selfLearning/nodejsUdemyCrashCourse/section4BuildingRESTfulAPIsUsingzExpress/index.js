const express = require('express');

const PORT = process.env.PORT || 5005;

const app = express();

app.get('/', (req, res) => {
	res.send('Hello');
});

app.get('/api/courses', (req, res) => {
	res.send(["Java", "Express", "Node", "Python"]);
});

app.get('/api/courses', (req, res) => {
	res.send(`req.query: ${JSON.stringify(req.query)}`);
});

app.get('/api/courses/:id', (req, res) => {
	res.send(`req.params.id: ${req.params.id}`);
});

app.get('/api/courses/:year/:month', (req, res) => {
	res.send(`req.params: ${req.params}`);
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`)
})
