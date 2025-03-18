const {logger} = require('../utils/logger.js');

// Error handliong centralised with a middleware in index
// This middleware has 4 than usual 3 params ( err, req, res, next)
const error = function (err, req, res, next){
	console.log('inside error.js');
	logger.info(`Error: ${err.message}`);

	const customMessage = err.custom || 'custom An error occurred';
	const errorMessage = err.message || 'error An error occurred';
	const statusCode = err.status || 500;

	res.status(statusCode).send({ customMessage: customMessage , errorMessage: errorMessage});
}

module.exports.error = error;