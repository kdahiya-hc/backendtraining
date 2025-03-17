
// Error handliong centralised with a middleware in index
// This middleware has 4 than usual 3 params ( err, req, res, next)
const error = function (err, req, res, next){
	res.status(500).send({ customMessage: err.custom , errorMessage: err.message});
}

module.exports.error = error;