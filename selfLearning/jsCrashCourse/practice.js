// // Comments: // for single-line and /*...*/ for multi-line.

// // Variables: let (reassignable), const (constant).
// let age = 30;
// const name = "John";

// // Data Types: Boolean, Number (float), Array, and Object.
// let isActive = true;  // Boolean
// let score = 85.5;     // Number
// let fruits = ["apple", "banana"];  // Array
// let person = { name: "John", age: 25 };  // Object

// // String Methods: toLowerCase(), toUpperCase(), trim().
// let str = "  Hello World!  ";
// str = str.toLowerCase();  // "hello world!"
// str = str.trim();         // "Hello World!"

// // Loops: for and while loops to iterate over arrays.
// for (let i = 0; i < fruits.length; i++) {
//   console.log(fruits[i]);
// }

// let i = 0;
// while (i < fruits.length) {
//   console.log(fruits[i]);
//   i++;
// }

// // Concatenation: Using + to combine strings.
// let greeting = "Hello, " + name + "!";

// // Concatenation using Template Strings: Using backticks (`) for string interpolation.
// let message = `My name is ${name} and I am ${age} years old.`;

// // Arrays: Ordered collection of items.
// let numbers = [1, 2, 3, 4];

// // JSON stringify from Array of object or object: Convert to JSON string.
// let jsonString = JSON.stringify(person);  // '{"name":"John","age":25}'

// // Objects: Collection of key-value pairs.
// let car = { brand: "Toyota", model: "Corolla" };

// // Array of Objects: Array where each element is an object.
// let people = [
//   { name: "John", age: 25 },
//   { name: "Alice", age: 30 }
// ];

// // Object Literals: Direct definition of an object using `{}`. Exactly Objects itself

// const todos = [
// 	{
// 		id : 1,
// 		text: "Kishan",
// 		isCompleted: true
// 	},
// 	{
// 		id : 2,
// 		text: "Krupa",
// 		isCompleted: true
// 	},
// 	{
// 		id : 3,
// 		text: "Ravi",
// 		isCompleted: false
// 	},
// ]
// // For of iterations
// for( let todo of todos){
// 	console.log(todo.text)
// }

// // High order Functions forEach, map, filter
// todos.forEach(function(todo){
// 	console.log(todo.text)
// })

// const todoText1 = todos.map(function(todo){
// 	return todo.text;
// })
// console.log(`map returns the array : ${todoText1}`)

// const todoText2 = []
// todos.forEach(function(todo){
// 	todoText2.push(todo.text)
// })
// console.log(`forEach doesnt return any array : ${todoText2}`)

// const replacerUsingValue = (key, value)=>{
// 	if (value === true){
// 		return undefined;
// 	}
// 	return value;
// };

// const replacerUsingKey = (key, value)=>{
// 	if (key === 'isCompleted'){
// 		return undefined;
// 	}
// 	return value;
// };

// const todoText3 = todos.filter(function(todo){
// 	return todo.isCompleted === true;
// })
// console.log(`filter returns the array : ${JSON.stringify(todoText3, replacerUsingKey, 2)}`)

// const todoCompleted = todos.filter(function(todo){
// 	return todo.isCompleted === true;
// }).map(function(todo){ return todo.text})
// console.log(`filter returns the array : ${JSON.stringify(todoCompleted, null, 2)}`)

// Trying basic ChatGPT generated questions to test my learning of these 3 methods
const array = [10,20,3,4,50,60,7,8,90,100]
// array.forEach(function(arr){ if(arr%2 == 0){console.log(arr)}})

// const squared = array.map(function(arr){return arr*arr})
// console.log(squared)

// const greater = array.filter(function(arr){if(arr>10){return arr}})
// console.log(greater)

// const flipflop = array.map(arr => arr!=arr)
// console.log(squared)

// // Conditionals
// const x = 10;
// const y =  20;
// // if (x == 10){console.log(x)}

// if (x === 10){console.log("Is Match")}else{console.log("Not Match")}

// if (x === 10){console.log("Is 10")}else if (x > 10){console.log("great than 10")}else{console.log("less than 10")}

// if (x > 10 || y > 10) {
// 	console.log("x or y > 10");
// }else if (x < 10 || y > 10) {
// 	console.log("x < 10 or y > 10");
// } else {
// 	console.log("less than 10");
// }

// if (x > 10 && y > 10) {
// 	console.log("x and y > 10");
// }else if (x < 10 && y > 10) {
// 	console.log("x < 10 and y > 10");
// } else {
// 	console.log("404");
// }

// // Ternary Operator with mixed operators
// const x = 8;
// const color = x >= 10 ? 'red' : 'blue';
// // console.log(color)

// switch (color){
// 	case 'red':
// 		console.log('color is red');
// 		break;
// 	case 'blue':
// 		console.log('color is blue');
// 		break;
// 	default:
// 		console.log('color is not red or blue');
// 		break;
// }

// Functions with parameters

// function addNumbs(num1, num2){
// 	return num1 + num2;
// }

// console.log(addNumbs(4,5)); //9
// console.log(addNumbs()) //Nan

// Arrow functions ES6 2015, default values

// const addNumbs = (num1 = 0, num2 = 0)=>num1+num2;
// console.log(addNumbs(4,5)); //9
// console.log(addNumbs()) //0

// Constructor function and this keyword
// function Person(firstName, lastName, dob){
// 	this.firstName = firstName;
// 	this.lastName = lastName;
// 	this.dob = new Date(dob);

// 	this.getBirthYear = function(){
// 		return this.dob.getFullYear();
// 	}

// 	this.getFullName = function(){
// 		return `${this.firstName} ${this.lastName}`
// 	}
// }

// // Instantiate Object
// const person1 = new Person('Kishan', 'Dahiya', '1999-6-15');
// console.log(JSON.stringify(person1));
// console.log(person1.dob.getFullYear())
// console.log(person1.getBirthYear())
// console.log(person1.getFullName())

// // Function in Prototypes
// function Person(firstName, lastName, dob){
// 	this.firstName = firstName;
// 	this.lastName = lastName;
// 	this.dob = new Date(dob);
// }

// Person.prototype.getBirthYear = function(){
// 	return this.dob.getFullYear();
// }

// Person.prototype.getFullName = function(){
// 	return `${this.firstName} ${this.lastName}`
// }

// const person1 = new Person('Jay','Shah','2000-10-10')
// console.log(person1)
// console.log(person1.getBirthYear())

// // Class with method(Function in class) inside
// class Person{
// 	constructor(firstName, lastName, dob){
// 		this.firstName = firstName;
// 		this.lastName = lastName;
// 		this.dob = new Date(dob);
// 	}

// 	getBirthYear(){
// 		return this.dob.getFullYear();
// 	}

// 	getFullName(){
// 		return `${this.firstName} ${this.lastName}`
// 	}
// }

// const person1 = new Person('Jay','Shah','2000-10-10')
// console.log(JSON.stringify(person1))
// console.log(person1.getBirthYear())

//DOM??
