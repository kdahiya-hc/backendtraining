import {createServer} from 'http';

const PORT=process.env.PORT || 5005;

const users = [
	{ id:1, name:'John Doe'},
	{ id:2, name:'Jane Doe'},
	{ id:3, name:'Jay Shah'},
];

// Middleware usually put in seperate file.
// Logger Middleware
const logger = (req, res, next) => {
	console.log(`Method ${req.method} at url ${req.url}`);
	next();
};

// JSON Middleware
const jsonMiddleware = (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	next();
}

// HTML Middleware
const htmlMiddleware = (re, res, next) => {
	res.setHeader('Content-Type','text/html');
};

// Route Handler for GET /api/users
const getUsersHandler = (req, res) => {
	res.end(JSON.stringify(users));
};

// Route Handled for not found
const notFoundHandler = (req, res) => {
	res.end('<h1 style="text-align: center;">Route Not Found</h1>');
};

// Route Handler for GET /api/users/:id
const getUsersById = (req, res) => {
	const id = parseInt(req.url.split('/')[3]);
	const user = users.find((user) => user.id === id);
	if (user) {
		res.end(JSON.stringify(user));
	} else {
		res.end(JSON.stringify({ message: 'User not found' }));
	}
};

// Route Handler for POST /api/users
const createUserHandler = (req, res) => {
	let body = '';
	//Listen for data
	req.on('data', (chunk) => {
		body += chunk.toString()
	});
	req.on('end', () => {
		const newUser = JSON.parse(body);
		users.push(newUser);
		res.statusCode = 201;
		res.write(JSON.stringify(newUser));
		res.end();
	})
};

// Server
const server = createServer( async (req, res) =>{
	logger(req, res, () =>{
		jsonMiddleware(req, res, () => {
			if (req.url === '/api/users' && req.method === 'GET'){
				res.statusCode = 200;
				getUsersHandler(req, res);
			}else if (req.url.match(/\/api\/users\/([0-9]+)$/) && req.method === 'GET'){
				res.statusCode = 200;
				getUsersById(req, res);
			}else if (req.url === '/api/users' && req.method === 'POST'){
				createUserHandler(req, res);
			}else{
				htmlMiddleware(req, res);
				res.statusCode = 404;
				notFoundHandler(req, res);
			}
		});
	});
});

// Server log
server.listen(PORT,() => {
	console.log(`Listening on http://localhost:${PORT}`);
});
