import path from 'path';
import url from 'url';

const filePath = '/root/subDir1/File.txt';

// extname() returns extensiom of current filePath: .txt
console.log(`1. extname(): ${path.extname(filePath)}`);

// basename() returns current filePath: File.txt
console.log(`2. basename(): ${path.basename(filePath)}`);

// dirname returns up to current filePath: /root/subDir1
console.log(`3. dirname(): ${path.dirname(filePath)}`);

// toNamespacedPath()
console.log(`4.toNamespacedPath(): ${path.toNamespacedPath(filePath)}`);

// parse gives object with all above
console.log(`5.parse() ${JSON.stringify(path.parse(filePath))}`);

// ES Module making own __dirname and __filename
const __filename = url.fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// join() just concantenates the path
const filePath2 = path.join(__dirname, 'dir1', 'dir2', 'test.txt');
console.log(filePath2)

// resolve() gets the absolute path
const filePath3 = path.resolve(__dirname, 'dir1', 'dir2', '..', 'test.txt');
console.log(filePath3)
