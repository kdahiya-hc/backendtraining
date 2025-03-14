const bcrypt = require('bcrypt');

const password = 'june1999'

async function run() {
	console.log(`Salt: ${salt}`);
	console.log(`Password: ${password}`);
	console.log(`Hashed Password: ${hashedPassword}`);
}

run();
