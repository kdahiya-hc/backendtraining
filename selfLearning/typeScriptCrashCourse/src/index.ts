// Basic types
let id:number = 5;
let company:string = 'Heartcore Inc.';
let isEmployee:boolean = true;
let x:any = '5';
let age:number = 5;
age = 20;

console.log('id: ', id);
console.log('company: ', company);
console.log('isEmployee: ', isEmployee);
console.log('x: ', x);
console.log('age: ', age);

// --------------------------------------------------------------------------------------------------

// Arrays with types
let array1: number[] = [ 1, 2, 3, 4, 5];
// array1.push('6'); // Error

console.log('array1: ', array1);

let array2: any[] = [ 1, true, 'Correct', [ 1, 2, true]];
array2.push('6'); // No Error

console.log('array2: ', array2);

// --------------------------------------------------------------------------------------------------

// tuples
let tuple1:[number, boolean, string ] = [ 1, true, 'Correct'];
console.log('tuple1: ', tuple1);

// tuple array
let tuple2:[number, boolean, string][] = [
	[ 1, true, 'Kishan'],
	[ 2, true, 'Krupa'],
	[ 3, false, 'Jay'],
];
console.log('tuple2: ', tuple2);

// --------------------------------------------------------------------------------------------------

// unions
let eid: string | number;
eid = '22';

console.log('union variable eid : ', eid);

// --------------------------------------------------------------------------------------------------

// enums
enum Direction1 {
	Up = 1,
	Down = 2,
	Left, // itself gets 3 as it is after 1 and 2, else has 2 as index starts at 0
	Right = 3
}

console.log('enum up index', Direction1.Up);
console.log('enum down index', Direction1.Down);
console.log('enum left index', Direction1.Left);
console.log('enum right index', Direction1.Right);

enum Direction2 {
	Up = 'Up',
	Down = 'Down',
	// Left, // Error as it does not have initializer
	Right = 'Right'
}

console.log('enum up intialized to', Direction2.Up);
console.log('enum down intialized to', Direction2.Down);
// console.log('enum left intialized to', Direction2.Left);
console.log('enum right intialized to', Direction2.Right);

// --------------------------------------------------------------------------------------------------

// objects declaration and defination using in-line, type and interface

// declare User1 in-line
const user1: {
		id: number,
		name: string
	} = {
		id: 1,
		name: 'John'
	}

console.log('User 1', user1);

// --------------------------------------------------------------------------------------------------

// user declared by type
type User2 = {
		id: number,
		name: string
	}

const user2: User2 = {
		id: 2,
		name: 'Mary'
	}

console.log('User 2', user2);

// --------------------------------------------------------------------------------------------------

// We can do the object also with interface
// user declared by interface
interface UserInterface {
    readonly id: number;
    name?: string;
}

// to make properties optional in interface add ?
// to make properties readonly in interface add readonly
const user3: UserInterface = {
    id: 3,
};
// user3.id = 90; // Error as id is read only
user3.name = 'Jay';

console.log('User 3', user3);

// interface can not be used with unions like types
type Point1 = number | string; // Works
// interface Point2 = number | string; // Error, use union with properties

// interface with arrow function or fucntion
interface MathFunc {
	(x:number, y:number): number
}

// if type is changed it will give error as MathFunc has param and return types defined
const sumAdd: MathFunc = ( x: number, y: number): number => x + y;
console.log(`The result is ${sumAdd(2,3)}`);

const sumSub: MathFunc = ( x, y ) => x - y;
console.log(`The result is ${sumSub(2,3)}`);

// --------------------------------------------------------------------------------------------------

// type assertion by either "= <type> variable" or "= variable as type"
let cid1: any= 1;
let cid2 = '1';
let customerId1 = <number>cid1;
console.log('Customer Id 1 type is', typeof customerId1);

let customerId2 = <string>cid2; // Works with cid1 has 'any' , if 'any' is removed we get error
console.log('Customer Id 2 type is String?', typeof customerId2 === 'string' );

// let customerId3 = cid2 as number; // Error
let customerId3 = cid1 as number;
console.log('Customer Id 3 type is', typeof customerId3);

// let customerId4 = cid2 as boolean; // Error
let customerId4 = cid2 as string; // Error
console.log('Customer Id 4 type is', typeof customerId4);

// --------------------------------------------------------------------------------------------------

// functions
// setting type to parameters and returns
function addNum(a: number, b: number):number {
	return a+b;
}

let a: any = 3;
let b: any = 5;
console.log(`Addition of ${a} and ${b} is ${addNum(3,5)}`);

// functions setting void returns
function greet(name: string | number):void {
	console.log(`Inside function with no return type\nHello ${name}`)
}

let call = greet('Kishan');
console.log('Calling function with no return type: ',call); // No return so undefiend

// --------------------------------------------------------------------------------------------------

// Classes

// Can also implement interface to class
interface PersonInterface{
	id: number
	name: string
	register(): string
}

class Person implements PersonInterface {
	// // access modifiers to make public private protected
	// private id: number
	// name: string
	id: number
	name: string

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	  }

	// class methods
	register(){
		return `${this.name} is registered!`;
		// return 1; // Error as interface says return should be string
	}
}

const brad = new Person(1,'Brad');
console.log('Brad : ', brad);
console.log(brad.register());

// --------------------------------------------------------------------------------------------------

// Extending class

class Employee extends Person{
	position: string

	constructor(id: number, name: string, position: string){
		super(id, name);
		this.position = position
	}
}

const shawn = new Employee(2, 'Shawn', 'Developer')
console.log('Shawn : ', shawn);
console.log(shawn.register());

// --------------------------------------------------------------------------------------------------

// generics
// // non generic function
// function getArray(items: any[]): any[] {
// 	return new Array().concat(items);
// }
// generic function
function getArray<T>(items: T[]): T[] {
	return new Array().concat(items);
}

let numArray = getArray<number>([1,2,3,4,5]);
console.log(numArray);
let strArray = getArray<string>(['brad', 'john', 'mary']);
console.log(strArray);

// numArray.push('Hello'); // Error as T is number in <number>
