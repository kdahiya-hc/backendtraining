// middlewares/error.js
// To make this error handler middleware work, in every code i should write (req, res, next) and next(err).
// This middleware has 4 than usual 3 params ( err, req, res, next)
const error = function (err, req, res, next){
	console.log('inside error.js');
	return res.status(500).json({
		success: false,
		message: err.message,
		value: { }
	});
}

module.exports.error = error;