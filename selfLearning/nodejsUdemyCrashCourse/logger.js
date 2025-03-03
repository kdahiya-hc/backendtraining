const EventEmitter = require('events');

class Logger extends EventEmitter{
	//Method log
	log(message){
		console.log(message)
		// Raised event with argument
		this.emit('messageLogged',{id: 1, url: 'https://logger.log'});
	}
}

module.exports = Logger;
