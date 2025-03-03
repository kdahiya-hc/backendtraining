const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

function log(message){
	console.log(message)
	// Raise an event
	eventEmitter.emit('messageLogged',{id: 1, url: 'https://logger.log'});
}

module.exports = {log, eventEmitter};
