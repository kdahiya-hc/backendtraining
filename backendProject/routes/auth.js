// /routes/auth.js
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validateUser: validate } = require('../models/User');
const express = require('express');
const router = express.Router({ mergeParams: true });

// Register a user
router.post('/register', async (req, res) => {
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
			return res.status(400).json({
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
		});

		await newUser.save();

		return res.status(201).json({
			success: true,
			message: 'New user added',
			value: { user: _.pick(newUser, ['email', 'name']) }
		});
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value : { }
		});
	}
});

// Login a registered user
router.post('/login', async (req, res) => {
	try {
		console.log('In login');
		const validUser = await User.findOne({ email: req.body.email });
		if (!validUser){
			return res.status(400).json({
				success: false,
				message: 'Invalid email or password',
				value: { }
			});
		}

		const validPassword = await bcrypt.compare(req.body.password, validUser.password);
		if (!validPassword){
			return res.status(400).json({
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
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
});

// Verify OTP and return JWT
router.post('/verify-otp', async (req, res) => {
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
				success: false,
				message: isOtpValid.message,
				error: 'OTP verification failed'
			});
		}
	} catch(err) {
		return res.status(500).json({
			success: false,
			message: err.message,
			value: { }
		});
	}
});

module.exports = router;
