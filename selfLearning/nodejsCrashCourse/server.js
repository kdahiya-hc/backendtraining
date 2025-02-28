import http from 'http';
// importing the module to handle or fetch files, multiple ways to use. Asynchoronus or Synchronous and Promise version with .then
import fs from 'fs/promises';
// Libraries to get URL and Path creating variables that fetch file name and directory name
import url from 'url';
import path from 'path';

// Variables to get Path(Not using ES modules but libraries to create the same variables)
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename);
console.log(__dirname);

// Port from .env
const PORT = process.env.PORT;

// Creating a server handling request and response
const server = http.createServer(async (req, res) => {
	// // Starting with basic response and request url or method checks
	// console.log('The URL is ',req.url);
	// console.log('The Method is ',req.method);

	// res.setHeader('Content-Type', 'text/html');
	// res.statusCode = 404;

	// // Can combine the above in one as below
	// res.writeHead(200, {'Content-Type':'text/html'});

	// res.write('Hello World!'); // Content being written
	// res.end('<h1>Hello Kishan :)</h1>');

	// res.end(JSON.stringify({message: 'Server Error'}));

	// // Try to combine wverything from above and it gives us the below which checks the URL, writesHead status code and content with response.
	// // Also implement a try catch to catch other than methods being handled aka server error
	// try{
	// 	if (req.method === 'GET'){
	// 		if (req.url === '/'){
	// 			res.writeHead(200, {'Content-Type':'text/html'});
	// 			res.end('<h1>Home</h1>');
	// 		}else if (req.url === '/about'){
	// 			res.writeHead(200, {'Content-Type':'text/html'});
	// 			res.end('<h1>About</h1>');
	// 		}else{
	// 			res.writeHead(404, {'Content-Type':'text/html'});
	// 			res.end('<h1>Not Found</h1>');
	// 		}
	// 	}else{
	// 		throw new Error('Method not allowed!');
	// 	}
	// }
	// catch(error){
	// 	res.writeHead(500, {'Content-Type':'text/plain'});
	// 	res.end('Server Error!');
	// };

	// Try to implement end points serving files
	try{
		// Check if it is GET
		if (req.method === 'GET'){
			let filePath;
			if (req.url === '/'){
				filePath = path.join(__dirname, 'public', 'home.html');
			}else if (req.url === '/about'){
				filePath = path.join(__dirname, 'public', 'about.html');
			}else{
                filePath = path.join(__dirname, 'public', req.url);
			}

			try{
				const data = await fs.readFile(filePath);
				res.writeHead(200, 'Content-Type', 'text/html');
				res.write(data);
				res.end();
			}catch(fileReadError){
				res.writeHead(404, 'Content-Type', 'text/html');
                res.write('<h1>404 Not Found</h1>');
				res.end();
			}
		}else{
			res.writeHead(405, { 'Content-Type': 'text/html' });
			res.write('<h1>405 Method Not Allowed</h1>');
			res.end();
		}
	} catch(error){
		res.writeHead(500, {'Content-Type':'text/html'});
		res.write(await fs.readFile(path.join(__dirname, 'public', 'error.html')));
		res.end();
	};
});

server.listen(PORT, ()=>{
	console.log(`Server is listening on http://localhost:${PORT}`)
});
