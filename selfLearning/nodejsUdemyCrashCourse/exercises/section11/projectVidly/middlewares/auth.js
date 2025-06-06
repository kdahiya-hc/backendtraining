const config = require('config')
require('dotenv').config()
const jwt = require('jsonwebtoken');

function auth( req, res, next){
	const token = req.header('x-auth-token');
	if (!token) { return res.status(401).json({message: 'Access denied!'}); }
	try {
		const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey') )
		if (!decodedPayload) { return res.status(401).json({message: 'Access denied. No valid token found'}); }
		req.user = decodedPayload;
		next();
	} catch(err) {
		res.status(400).json({ message: 'Error', error: err.message });
	}
}

module.exports.auth = auth;