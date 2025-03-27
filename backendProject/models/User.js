require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    street: { type: String, maxlength: 100, required: false },
    ward: { type: String, maxlength: 100, required: false },
    city: { type: String, maxlength: 100, required: true },
    postalCode: { type: Number, max: 9999999, required: true },
  },
  dob: { type: Date, required: true },
  otp: {
    type: [{
      otpHash: { type: String, maxlength: 250, required: true },
      exp: { type: Date, default: Date.now() + 1 * 60 * 1000, required: true },
      attempts: { type: Number, default: 0, required: true },
    }],
    default: [],
    required: false
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, default: [] }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequest',required: true , index: true, default: [] }],
  },{
    timestamps: true,
  });

userSchema.methods.generateAuthToken = function() {
  try{
    return {
      success: true,
      message: 'JWT is generated',
      value: { token: jwt.sign({ _id: this._id }, config.get('jwtSecret'), { expiresIn: "10m" })}
    };
  }catch(err){
		throw new Error(err.message);
  }
}

userSchema.methods.generateOtp = async function () {
  try{
    const now = Date.now();
    this.otp = this.otp.filter(otp => otp.exp > now);

    if (this.otp.length >= 3) {
      throw new Error("Maximum OTP limit reached. Please wait for OTP expiry.");
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const otpObject = {
      otpHash: hashedOtp,
    };

    this.otp.push(otpObject);

    await this.save()

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
    const otpObject = this.otp.find(otp => otp.exp > Date.now() && otp.attempts <= 3);

    if (!otpObject){
      return {
        success: false,
        message: 'No valid OTP found or OTP expired',
        value: { }
      };
    }

    otpObject.attempts++;

    if (otpObject.attempts > 3) {
      this.otp = this.otp.filter(otp => otp !== otpObject);
      await this.save();
      return {
        success: false,
        message: 'OTP attempts exceeded, please request a new OTP',
        value: { }
      };
    }

    const isMatch = await bcrypt.compare(enteredOtp, otpObject.otpHash);

    await this.save();

    if (isMatch && Date.now() < otpObject.exp) {
      return {
        success: true,
        message: 'OTP verified successfully',
        value: { token: this.generateAuthToken().value }
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP or OTP expired',
        value: { }
      };
    }
  } catch(err) {
    throw new Error(err.message);
  }
};

const User = mongoose.model('User', userSchema);

function validateUser(data) {
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
    }).required(),
    dob: Joi.date().required(),
    otp: Joi.object({
      otp: Joi.string().min(4).max(4).required(),
      }).optional(),
    friends: Joi.array().items(Joi.objectId()).optional(),
    pendingRequests: Joi.array().items(Joi.objectId()).optional(),
    }).options({ stripUnknown: true });

  return schema.validate(data);
}

module.exports = { User, validateUser };