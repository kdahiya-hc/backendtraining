const {log, eventEmitter} = require('./logger.js');

eventEmitter.on('messageLogged', (arg) => {
	console.log('Listener called', arg);
})

log('Kishan');
