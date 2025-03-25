const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, minlength: 8, maxlength: 250, required: true },
  name: {
    firstName: { type: String, minlength: 3, maxlength: 50, required: true },
    middleName: { type: String, maxlength: 50 },
    lastName: { type: String, minlength: 3, maxlength: 50, required: true }
  },
  address: {
    apartment: { type: String, maxlength: 100 },
    street: { type: String, maxlength: 100 },
    ward: { type: String, maxlength: 100 },
    city: { type: String, maxlength: 100 },
    postalCode: { type: Number, max: 9999999 }
  },
  dob: { type: Date, required: true },
  otp: {
    otp: { type: Number, min: 1111, max: 9999 },
    exp: { type: Date }
  },
  registeredOn: { type: Date, default: Date.now },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).max(50).required(),
    name: Joi.object({
      firstName: Joi.string().trim().min(3).max(50).required(),
      middleName: Joi.string().trim().max(50).optional(),
      lastName: Joi.string().trim().min(3).max(50).required()
    }).required(),
    address: Joi.object({
      apartment: Joi.string().trim().max(100).optional(),
      street: Joi.string().trim().max(100).optional(),
      ward: Joi.string().trim().max(100).optional(),
      city: Joi.string().trim().max(100).required(),
      postalCode: Joi.number().max(9999999).required()
    }).optional(),
    dob: Joi.date().required(),
	otp: Joi.object({
		otp: Joi.number().min(1111).max(9999).required(),
	  }).optional(),
    friends: Joi.array().items(Joi.objectId()).optional(),
  });

  return schema.validate(data);
}

userSchema.methods.generateOtp = function () {
	this.otp = {
	  otp: Math.floor(1000 + Math.random() * 9000),
	  exp: Date.now() + 5 * 60 * 1000
	};
  };

module.exports = { User, validate };