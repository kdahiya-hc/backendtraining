const http = require('http');

const PORT = 5005;

const server = http.createServer((req, res) => {
	if( req.url === '/'){
		res.write('Hello');
		res.end();
	}

	if( req.url === '/api/courses'){
		res.write(JSON.stringify([1, 2, 3]));
		res.end();
	}
});

// server.on('connection',(socket) =>{
// 	console.log('New Connection')
// });

server

server.listen(PORT);

console.log(`Listening on http://localhost:${PORT}`);
