// Everything is callback based
import fs from 'fs';
// promise based can use async await
import fsp from 'fs/promises';

// // readFile() -- callback or asynchronous
// // "Callback-Based Asynchronous File Read (fs.readFile)"
// fs.readFile('./test.txt', 'utf-8', (err, data) => {
// 	if (err) throw err;
// 	console.log(data);
// });

// // readFileSync() - Synchronous Version. It is blocking
// // "Synchronous File Read (fs.readFileSync)"
// const data = fs.readFileSync('./test.txt', 'utf-8');
// console.log(data);

// // readFile() - promise .then()
// // "Promise-Based Asynchronous File Read (fs/promises.readFile) with .then/.catch"
// fsp.readFile('./test.txt', 'utf-8')
//  .then((data) => console.log(data))
//  .catch((err) => console.log(err));

// async/await. Write like synchronous but is asynchronous
// "Promise-Based Asynchronous File Read (fs/promises.readFile) with async/await"
const readFile = async () => {
	try {
		const data = await fsp.readFile('./test.txt', 'utf-8');
		console.log(data);
	} catch (error) {
		console.log(error);
	}
};

// // "Promise-Based Asynchronous File Write (fs/promises.writeFile) with async/await"
// const writeFile = async () => {
// 	try {
// 		await fsp.writeFile('./test.txt', 'Hey I just wrote to this file.');
// 		console.log('Wrote to file');
// 	} catch (error){
// 		console.log(error);
// 	}
// };

// Append
const appendFile = async () => {
	try {
		await fsp.appendFile('./test.txt', 'Appended without overwriting!');
		console.log("Appended to file")
	} catch (error) {
		console.log(error);
	}
};

// writeFile();
appendFile();
readFile();
