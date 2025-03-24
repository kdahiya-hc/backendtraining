require("dotenv").config();
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = config.get('db');
const dbUri = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`

// Connect to MongoDB
mongoose.connect(dbUri, {authSource: "admin",})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/", require("./routes/home"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected to ${dbConfig.database}...`));
