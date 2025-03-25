const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth.js')

// Sample route
router.get('/', auth, (req, res) => {
	res.status(200).json({ message: 'Hello'});
});

module.exports = router;
