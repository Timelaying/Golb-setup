// Environment variables for secrets
require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt
const authRoutes = require("./AuthRoute"); // Import the router module
const registerRoute = require("./RegisterRoute");
const forgetandreset = require("./ForgetAndReset");
const createPostRoute = require("./CreatePostRoute");
const viewposts = require("./ViewPost");


const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


// Mount the auth routes on the `/api` path
app.use("/api", registerRoute);
app.use("/api", authRoutes);
app.use("/api", forgetandreset);
app.use("/api", createPostRoute); // Create post routes
app.use("/api", viewposts)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
