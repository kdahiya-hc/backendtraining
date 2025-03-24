require('dotenv').config();
const config = require('config');
const jwt = require("jsonwebtoken");
const SECRET_KEY = config.get('jwtPrivateKey');

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
