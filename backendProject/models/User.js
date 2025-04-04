// /models/User.js
require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const redis = require('../utils/redisClient');

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       description: A user
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: email of the user
 *           format: email
 *         password:
 *           type: string
 *           description: A valid password string
 *           format: password
 *           pattern: "^[a-zA-Z0-9$%!@_-]{8,}$"
 *         name:
 *           type: object
 *           description: Name of the user
 *           properties:
 *             firstName:
 *               type: string
 *               summary: first name of user
 *             middleName:
 *               type: string
 *               summary: middle name of user
 *             lastName:
 *               type: string
 *               summary: last name of the user
 *           required:
 *             - firstName
 *             - lastName
 *         address:
 *           type: object
 *           description: Address of the user
 *           properties:
 *             apartment:
 *               type: string
 *               summary: name of the apartment
 *             street:
 *               type: string
 *               summary: name/number of street
 *             ward:
 *               type: string
 *               summary: name of the ward
 *             city:
 *               type: string
 *               summary: name of the city
 *             postalCode:
 *               type: integer
 *               summary: postal code without hiphens
 *           required:
 *             - apartment
 *             - city
 *             - postalCode
 *         dob:
 *           type: string
 *           description: date of birth in YYYY-MM-DD format
 *           format: date
 *         friendsId:
 *           type: array
 *           description: Array of userIds
 *           items:
 *             type: string
 *             description: 24-hex-decimal userId
 *             pattern: "^[a-fA-F0-9]{24}$"
 *           default: []
 *         pendingRequestsId:
 *           type: array
 *           description: Array of friendRequest IDs
 *           items:
 *             type: string
 *             description: 24-hex-decimal friendRequest ID
 *             pattern: "^[a-fA-F0-9]{24}$"
 *           default: []
 *       required:
 *         - email
 *         - password
 *         - dob
 *       example:
 *         email: "testuser@test.com"
 *         password: "12345678"
 *         name:
 *           firstName: Test
 *           lastName: User
 *         address:
 *           apartment: space water god
 *           city: Tokyo
 *           postalCode: 1234567
 *         dob: 2000-12-31
 *         friendsId: [ "aAbB1234cCdD5678eEfF9090", "aAbB1234cCdD5678eEfF9090"]
 *         pendingRequestsId: [ "aAbB1234cCdD5678eEfF9090", "aAbB1234cCdD5678eEfF9090"]
 *     updateUser:
 *       description: update existing user
 *       type: object
 *       properties:
 *         name:
 *           type: object
 *           description: Name of the user
 *           properties:
 *             firstName:
 *               type: string
 *               summary: first name of user
 *             middleName:
 *               type: string
 *               summary: middle name of user
 *             lastName:
 *               type: string
 *               summary: last name of the user
 *           required:
 *             - firstName
 *             - lastName
 *         address:
 *           type: object
 *           description: Address of the user
 *           properties:
 *             apartment:
 *               type: string
 *               summary: name of the apartment
 *             street:
 *               type: string
 *               summary: name/number of street
 *             ward:
 *               type: string
 *               summary: name of the ward
 *             city:
 *               type: string
 *               summary: name of the city
 *             postalCode:
 *               type: integer
 *               summary: postal code without hiphens
 *           required:
 *             - apartment
 *             - city
 *             - postalCode
 *         dob:
 *           type: string
 *           description: date of birth in YYYY-MM-DD format
 *           format: date
 *       required:
 *         - dob
 *       example:
 *         name:
 *           firstName: Test
 *           lastName: User
 *         address:
 *           apartment: space water god
 *           city: Tokyo
 *           postalCode: 1234567
 *         dob: 2000-12-31
*/

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, minlength: 8, maxlength: 250, required: true },
  name: {
    firstName: { type: String, minlength: 3, maxlength: 50, required: true },
    middleName: { type: String, maxlength: 50, required: false },
    lastName: { type: String, minlength: 3, maxlength: 50, required: true }
  },
  address: {
    apartment: { type: String, maxlength: 100, required: true },
    street: { type: String, maxlength: 100, default: '' },
    ward: { type: String, maxlength: 100, default: '' },
    city: { type: String, maxlength: 100, required: true },
    postalCode: { type: Number, min: 1000000, max: 9999999, required: true },
  },
  dob: { type: Date, required: true },
  friendsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  pendingRequestsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequest', default: [] }],
  }, { timestamps: true });

userSchema.methods.generateAuthToken = function() {
  try{
    return {
      success: true,
      message: 'JWT is generated',
      value: { token: jwt.sign({ _id: this._id }, config.get('jwtSecret'), { expiresIn: "60m" })}
    };
  }catch(err){
		throw new Error(err.message);
  }
}

userSchema.methods.generateOtp = async function () {
  try{
    const redisKey = `otp:${this.email}`;
    const otp = crypto.randomInt(1000, 9999).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const otpObject = {
      otpHash: hashedOtp,
      attempts: 0
    };

    await redis.set(redisKey, JSON.stringify(otpObject), 'EX', 300);

    return {
      success: true,
      message: 'OTP generated succesfully. Valid for 5mins',
      value: { otp : otp }
    };
  }catch(err){
		throw new Error(err.message);
  }
  };

userSchema.methods.verifyOtp = async function (enteredOtp) {
  try {
    const redisKey = `otp:${this.email}`;
    const otpObject = await redis.get(redisKey);

    if (!otpObject){
      return {
        success: false,
        message: 'No valid OTP found or OTP expired',
        value: { }
      };
    }

    const { otpHash, attempts } = JSON.parse(otpObject);

    if (attempts >= 3) {
      await redis.del(redisKey);
      return {
        success: false,
        message: 'OTP attempts exceeded, please request a new OTP',
        value: { }
      };
    }

    const isMatch = await bcrypt.compare(enteredOtp, otpHash);

    if (isMatch) {
      const jwtResult = this.generateAuthToken();
      await redis.del(redisKey);
      return {
        success: true,
        message: 'OTP verified successfully. '+ jwtResult.message,
        value: { token: jwtResult.value.token }
      };
    } else {
      await redis.set(redisKey, JSON.stringify({ otpHash, attempts: attempts + 1 }));
      return {
        success: false,
        message: `Invalid OTP. Attempts left: ${2 - attempts}`,
        value: {}
      };
    }
  } catch(err) {
    throw new Error(err.message);
  }
};

const User = mongoose.model('User', userSchema);

function validateNewUser(data) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).max(50).required(),
    name: Joi.object({
      firstName: Joi.string().trim().min(3).max(50).required(),
      middleName: Joi.string().trim().max(50).optional(),
      lastName: Joi.string().trim().min(3).max(50).required()
    }),
    address: Joi.object({
      apartment: Joi.string().trim().max(100).required(),
      street: Joi.string().trim().max(100).optional(),
      ward: Joi.string().trim().max(100).optional(),
      city: Joi.string().trim().max(100).required(),
      postalCode: Joi.number().max(9999999).required()
    }),
    dob: Joi.date().required(),
    friendsId: Joi.array().items(Joi.objectId()).optional(),
    pendingRequestsId: Joi.array().items(Joi.objectId()).optional(),
    }).options({ stripUnknown: true });

  return schema.validate(data);
}

function validateUpdateUser(data) {
  const schema = Joi.object({
    name: Joi.object({
      firstName: Joi.string().trim().min(3).max(50).required(),
      middleName: Joi.string().trim().max(50).optional(),
      lastName: Joi.string().trim().min(3).max(50).required()
    }).required(),
    address: Joi.object({
      apartment: Joi.string().trim().max(100).required(),
      street: Joi.string().trim().max(100).optional(),
      ward: Joi.string().trim().max(100).optional(),
      city: Joi.string().trim().max(100).required(),
      postalCode: Joi.number().max(9999999).required()
    }).required(),
    dob: Joi.date().required(),
    }).options({ stripUnknown: true });

  return schema.validate(data);
}

module.exports = { User, validateNewUser, validateUpdateUser };