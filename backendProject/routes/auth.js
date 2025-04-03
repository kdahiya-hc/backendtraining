// /routes/auth.js
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validateNewUser: validate } = require('../models/User');
const express = require('express');
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Register a user
 *     description: |
 *       It checks if entered data is valid and creates a user into the database.
 *     requestBody:
 *       description: Needs valid user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       201:
 *         description: Success in creating a user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       400:
 *         description: Wrong details passed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/badRequestResponse"
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
*/

// Register a user
router.post('/register', async (req, res, next) => {
	try {
		console.log('In register');

		const { error, value } = validate(req.body);
		if (error){
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
				value : { }
			});
		}

		const existingUser = await User.findOne({ email: value.email });

		if (existingUser){
			return res.status(404).json({
			success: false,
			message: 'User with this email already exists',
			value: { user: _.pick(existingUser, ['email', 'name']) }
		});
	}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(value.password, salt);

		const newUser = new User({
			email: value.email,
			password: hashedPassword,
			name: value.name,
			address: value.address,
			dob: new Date(value.dob),
			friendsId: value.friendsId,
			pendingRequestsId: value.pendingRequestsId,
		});

		await newUser.save();

		return res.status(201).json({
			success: true,
			message: 'New user added',
			value: { user: _.pick(newUser, ['email', 'name']) }
		});
	} catch(err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: login a user
 *     description: |
 *       It shall check if the entered email and password and then return an OTP. This OTP is valid for 5 minutes.
 *     requestBody:
 *       description: valid email and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: "testuser@test.com"
 *             password: 12345678
 *     responses:
 *       200:
 *         description: The entered credentials are valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/successResponse"
 *       400:
 *         description: No credentials passed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/badRequestResponse"
 *       401:
 *         description: Wrong credentials passed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/unauthorizedResponse"
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/errorResponse"
 */

// Login a registered user
router.post('/login', async (req, res, next) => {
	try {
		console.log('In login');

		if (!req.body.email || !req.body.password) {
			return res.status(400).json({
				success: false,
				message: 'Missing email or password',
				value: { }
			});
		}

		const validUser = await User.findOne({ email: req.body.email });
		if (!validUser){
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
				value: { }
			});
		}

		const validPassword = await bcrypt.compare(req.body.password, validUser.password);
		if (!validPassword){
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
				value: { }
			});
		}

		const otp = await validUser.generateOtp();
		return res.status(200).json({
			success: otp.success,
			message: otp.message,
			value: otp.value
		});
	} catch(err) {
		next(err);
	}
});

// Verify OTP and return JWT
router.post('/verify-otp', async (req, res, next) => {
	try {
		console.log('In verify-otp');

		const user = await User.findOne({ email : req.body.email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'User with this email does not exist',
				value: { user: { } }
			});
		}

		const isOtpValid = await user.verifyOtp(req.body.otp);

		if (isOtpValid.success) {
			return res.status(200).json({
				success: isOtpValid.success,
				message: isOtpValid.message,
				value: isOtpValid.value.token
			});
		} else {
			return res.status(400).json({
				success: isOtpValid.success,
				message: isOtpValid.message,
				value: isOtpValid.value
			});
		}
	} catch(err) {
		next(err);
	}
});

module.exports = router;
