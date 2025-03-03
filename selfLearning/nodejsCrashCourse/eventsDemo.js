import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

// greet handler
const greetHandler = (name) => {
	console.log('Hello', name);
};

// goodbye handler
const goodbyeHandler = (name) => {
	console.log('Goodbye',name);
};

// Register event listeners
myEmitter.on('greet', greetHandler);
myEmitter.on('goodbye', goodbyeHandler);

// Register Error handling before emmitting
myEmitter.on('error', (err) => {
	console.log('An error occurred', err);
});

// Emmit event
myEmitter.emit('greet', 'john');
myEmitter.emit('goodbye', 'john');
myEmitter.emit('error', new Error('Something is wrong'));
