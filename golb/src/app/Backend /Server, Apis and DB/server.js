require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Import database and routes
const pool = require("./db");
const authRoutes = require("./routes/auth.routes");
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
const viewcomments = require("./ViewComment");


app.use("/api/users", require("./routes/users.route"));
app.use("/api/posts", require("./routes/posts.route"));
app.use("/api/comments", require("./routes/comments.route"));
app.use("/api/auth", require("./routes/auth.route"));



const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API routes
app.use("/api", registerRoute);
app.use("/api", authRoutes);
app.use("/api", forgetandreset);
app.use("/api", createPostRoute);
app.use("/api", viewposts);
app.use("/api", profilepageroute);
app.use("/api", updateprofile);
app.use("/api", search);
app.use("/api", feed);
app.use("/api", follow);
app.use("/api", likeunlike);
app.use("/api", comment);
app.use("/api", dynamicprofile);
app.use("/api", viewcomments)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
