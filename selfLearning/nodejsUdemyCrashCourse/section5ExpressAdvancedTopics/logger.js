function log(req, res, next){
	console.log('Custom Middleware');
	// passes request object to next(); function which here is next in execution
	next();
};

module.exports = log;
