const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).render('index', {
		title: 'Home Page',
		message: 'Hello',
	});
});

module.exports = router;
