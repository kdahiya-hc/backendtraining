require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	console.log('In auth');
	const token = req.header('x-auth-token');
	if (!token) {
		return res.status(401).json({message: 'Access denied!'});
	}

	try {
		const decodedPayload = jwt.verify(token, config.get('jwtSecret') );
		req.user = decodedPayload;
		next();
	} catch(err) {
		res.status(400).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
}

module.exports = auth;
