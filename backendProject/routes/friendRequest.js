const _ = require('lodash');
const { FriendRequest, validateFriendRequest: validate } = require('../models/FriendRequest');
const auth = require('../middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Send friend request

// Cancel friend request

// Accept (Sender's Action) frienf request

// Reject (Receiver's Action) frienf request

module.exports = router;