// /routes/home.js
const express = require('express')
const router = express.Router({ mergeParams: true });
const crypto = require('crypto');

router.get('/:number', (req, res) => {
	try{
		console.log('In / to check server is listening on port');
		const number = parseInt(req.params.number);
		if (Number.isInteger(number)) {
			if (number%2 === 0){
				return res.status(200).json({
					success: true,
					message: 'Number is even',
					value: { number }
				});
			} else {
				return res.status(200).json({
					success: true,
					message: 'Number is odd',
					value: { number }
				})
			}
		}

		return res.status(400).json({
			success: false,
			message: 'Pass a number',
			value: { Text: req.params.number }
		})
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
});

module.exports = router;
