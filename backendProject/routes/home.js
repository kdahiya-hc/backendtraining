// /routes/home.js
const auth = require('../middlewares/auth');
const express = require('express')
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /{number}:
 *  get:
 *   tags:
 *    - home
 *   summary: Check if a number is odd or even
 *   description: |
 *    Given a number in the URL path, the endpoint checks if the number is odd or even.
 *
 *    If no number is passed, or if the value is not a number, it returns a 400 error.
 *   security:
 *    - xAuthToken: []
 *   parameters:
 *    - in: path
 *      name: number
 *      required: true
 *      description: The number to check
 *      schema:
 *       example: 5
 *   responses:
 *    200:
 *     description: Successfully received the number and checked if it is odd or even
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/defaultResponse"
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         message:
 *          type: string
 *          example: Number is even
 *         value:
 *          type: object
 *          properties:
 *           number:
 *            type: integer
 *            example: 0
 *    400:
 *     description: Bad Request - The input was not a valid number
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/defaultResponse"
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Pass a number
 *         value:
 *          type: object
 *          properties:
 *           number:
 *            type: string
 *            example: hello
 *    500:
 *     description: Internal Server Error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/defaultResponse"
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Internal server error
 *         value:
 *          type: object
 *          properties: {}
*/

router.get('/:number', auth, (req, res) => {
	try{
		console.log('In / to check server is listening on port');
		const number = Number(req.params.number);
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
