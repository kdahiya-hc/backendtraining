const _ = require('lodash');
const {User, validate } = require('../models/User');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// GET user detail with email
router.get('/:email', async (req, res) => {
	try{
		const user = await User.findOne({ email: req.params.email});

		if(!user){
			return res.status(404).json({ message: 'No user found'});
		}

		const userData =  _.pick(user, ['email', 'name']);
		return res.status(200).json({user : userData});
	} catch(err) {
		console.log(err.message);
		return res.status(500).json({error: err.message});
	}
});

// GET all users with pagination
router.get('/', async (req, res) => {
	try{
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const users = await User.find().skip(skip).limit(limit);

		if(users.length === 0){
			return res.status(200).json({ message: 'No Users found', users : []});
		}

		const usersData = users.map(user =>  _.pick(user, ['email', 'name']))
		return res.status(200).json({users : usersData});
	} catch(err) {
		console.log(err.message);
		return res.status(500).json({error: err.message});
	}
});

// Register a user
router.post('/register', async (req, res) => {
	try{
		const {error, value} = validate(req.body);
		if(error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const existingUser = await User.findOne({ email: value.email})
		if(existingUser){
			return res.status(400).json({ error: 'User with this email already exists' });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(value.password, salt);

		const newUser = new User({
			email: value.email,
			password: hashedPassword,
			name:{
				firstName: value.name.firstName,
				middleName: value.name.middleName,
				lastName: value.name.lastName
			},
			address:{
				  apartment: value.address.apartment,
				  street: value.address.street,
				  ward: value.address.ward,
				  city: value.address.city,
				  postalCode: value.address.postalCode
			},
			dob: new Date(value.dob),
		})

		await newUser.save();

		return res.status(201).json({message: 'New user added', user: _.pick(newUser, ['email', 'name'])});
	} catch(err){
		console.log(err.message);
		return res.status(500).json({error: err.message});
	}
})

// // Update a user
// router.put('/')

module.exports = router