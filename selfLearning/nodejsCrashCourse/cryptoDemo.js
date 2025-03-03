import crypto from 'crypto';

// createHash() - creating hash this is always same
const hashValue = crypto.createHash('sha256');
hashValue.update('passwordString');
const hashedPassword = hashValue.digest('hex');
console.log('Hashed Password (SHA-256):', hashedPassword);

// randomByptes() - it is always random
crypto.randomBytes(16, (err, buf) => {
	if (err) throw err;
	const randomHex = buf.toString('hex');
    console.log('Random Bytes (Hex):', randomHex);
})

//cypherText to encrypt decrypt data. iv ensures same plain text encrypted with same key is still different
// createCipheriv & createDecipheriv

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello I am Kishan', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('Encrypted message: ',encrypted);

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('Decrypted message: ',decrypted);
