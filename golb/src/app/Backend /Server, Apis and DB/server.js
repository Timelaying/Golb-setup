// Environment variables for secrets
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Import bcrypt

const authRoutes = require("./AuthRoute"); // Import the router module
const registerRoute = require("./RegisterRoute");
const forgetandreset = require("./ForgetAndReset");
const createPostRoute = require("./CreatePostRoute");
const viewposts = require("./ViewPost");
const profilepageroute = require("./ProfilePageRoute");
const updateprofile = require("./UpdateProfile");
const search = require("./Search");
const feed = require("./Feed");
const follow = require("./Follow");
const likeunlike = require("./LikeUnlike");
const comment = require("./Comment");
const dynamicprofile = require("./DynamicProfile");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());



// Mount the auth routes on the `/api` path
app.use("/api", registerRoute);
app.use("/api", authRoutes);
app.use("/api", forgetandreset);
app.use("/api", createPostRoute); // Create post routes
app.use("/api", viewposts);
app.use("/api", profilepageroute);
app.use("/api", search);
app.use("api", feed);
app.use("/api", follow);
app.use("api", likeunlike);
app.use("api", comment);
app.use("api", dynamicprofile);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
