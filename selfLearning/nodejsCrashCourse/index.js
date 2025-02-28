// const {generateRandomNumber, celciusToFahrenheit} = require('./utils');
// import { getPosts1, getPosts2, getPosts3 } from "./postController.js";
import defaultMethod, {getPosts2, getPosts3, getPostsLength} from "./postController.js";

// console.log(`The random number is: ${generateRandomNumber()}`);
// console.log(`Celcius to Fahrenheit is: ${celciusToFahrenheit(100)}`);

// // Below tries to convert the objects to string and results in [object, object], use JSON.stringify.
// console.log(`Get posts 1: ${getPosts1()}`); //${JSON.stringify(getPosts1()}
// console.log(`Get posts 2: ${getPosts2()}`);
// console.log(`Get posts 3: ${getPosts3()}`);

// // Below logs the array directly
console.log("Get posts 1:", defaultMethod()); // getPosts1 is exported as a default method hence we can use any name and just mention which module we are importing from
console.log("Get posts 2:", getPosts2());
console.log("Get posts 3:", getPosts3());

console.log("Length of posts is:", getPostsLength());
