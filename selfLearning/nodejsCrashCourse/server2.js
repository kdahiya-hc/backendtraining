import {createServer} from 'http';

const PORT=process.env.PORT;

const users = [
	{ id:1, name:'John Doe'},
	{ id:2, name:'Jane Doe'},
	{ id:3, name:'Jay Shah'},
];

const server = createServer( async (req, res) =>{
	if (req.url === '/api/users' && req.method === 'GET'){
		res.writeHead(200, {'Content-Type':'apllication/json'});
		res.end(JSON.stringify(users));
	}else if (req.url.match(/\/api\/users\/([0-9]+)$/) && req.method === 'GET'){
		res.writeHead(200, {'Content-Type':'apllication/json'});
		const id = parseInt(req.url.split('/')[3]);
		const user = users.find((user) => user.id === id);
		res.end(JSON.stringify(user));
	}else{
		res.writeHead(404,{'Content-Type':'text/html'});
		res.end('<h1 style="text-align: center;">Route Not Found</h1>')
	}
});

server.listen(PORT,() => {
	console.log(`Listening on http://localhost:${PORT}`);
});
