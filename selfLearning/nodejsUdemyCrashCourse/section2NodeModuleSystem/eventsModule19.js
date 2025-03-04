const EventEmitter = require('events');

// Since it is a class we can create new instance using the constructor
const emitter = new EventEmitter();

// Registered a listener
emitter.on('messageLogged', () => {
	console.log('Listener called');
})

// Raised event
emitter.emit('messageLogged');
