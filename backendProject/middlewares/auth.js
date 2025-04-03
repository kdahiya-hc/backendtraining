// /middlewares/auth.js
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
		if (err.name === "TokenExpiredError") {
			return res.status(400).json({
				success: false,
				message: 'Token has expired. Please log in again. ' + err.message,
				value: { }
			});
		}

		next(err);
	}
}

module.exports = auth;
