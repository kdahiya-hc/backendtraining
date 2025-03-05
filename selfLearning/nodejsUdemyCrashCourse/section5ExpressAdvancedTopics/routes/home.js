const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200)
	.render(
		'index',{
		title:'My Express Example',
		message: "Hi",
	});
});

module.exports = router;
