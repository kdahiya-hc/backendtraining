// middlewares/error.js
// To make this error handler middleware work, in every code i should write (req, res, next) and next(err).
// This middleware has 4 than usual 3 params ( err, req, res, next)
const error = function (err, req, res, next) {
	console.error('\n\nError occurred:', err.message);
	console.error('Stack Trace:', err.stack);
	console.error('\n\nRequest Path:', req.path);
	console.error('Request Body:', JSON.stringify(req.body, null, 2));
	console.error('Headers:', req.headers);

	return res.status(500).json({
		success: false,
		message: { error: err.message, stack: err.stack },
		value: { }
	});
}

module.exports.error = error;
