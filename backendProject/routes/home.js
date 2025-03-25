const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth.js');

router.get('/', auth, (req, res) => {
	res.status(200).json({ message: 'Hello'});
});

module.exports = router;
