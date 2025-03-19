function isAdmin( req, res, next){
	try {
		if (req.user.isAdmin) { return res.status(403).json({message: 'Forbidden access. Not enough permissions!'}); }
		next();
	} catch(err) {
		res.status(400).json({ message: 'Error', error: err.message });
	}
}

module.exports.isAdmin = isAdmin;