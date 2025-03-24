require('dotenv').config();
const config = require('config');
const _ = require('lodash');
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
const SECRET_KEY = config.get('jwtPrivateKey');

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists", userObject: _.pick(user, ['username', 'email']) });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.json({ msg: "User registered successfully", userObject: _.pick(user, ['username', 'email'])});
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all users (Admin only)
router.get("/users", auth, async (req, res) => {
	if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

	try {
	  const users = await User.find().select("-password");
	  res.json(users);
	} catch (err) {
	  res.status(500).json({ msg: "Server error" });
	}
  });

  // Delete user (Admin only)
  router.delete("/users/:id", auth, async (req, res) => {
	if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

	try {
	  await User.findByIdAndDelete(req.params.id);
	  res.json({ msg: "User deleted" });
	} catch (err) {
	  res.status(500).json({ msg: "Server error" });
	}
  });

module.exports = router;
