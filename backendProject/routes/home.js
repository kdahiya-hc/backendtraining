// /routes/home.js
const express = require('express')
const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
	res.status(200).json({ message: 'Hello'});
});

module.exports = router;
