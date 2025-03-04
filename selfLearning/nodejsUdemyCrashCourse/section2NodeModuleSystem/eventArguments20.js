const EventEmitter = require('events');

// Since it is a class we can create new instance using the constructor
const emitter = new EventEmitter();

// Registered a listener
emitter.on('messageLogged', (arg) => {
	console.log('Listener called', arg);
})

emitter.on('logging',(arg) => {
	console.log(`${arg['data']}`)
})

// Raised event with argument
emitter.emit('messageLogged',{id: 1, url: 'https://logger.log'});

// Raise: logging (data: message)
emitter.emit('logging', {data:'An event was triggered'});
