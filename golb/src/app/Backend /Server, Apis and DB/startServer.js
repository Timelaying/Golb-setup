// startServer.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const config = require("./config");
const pool = require("./db");

// Import all routes
const registerRoute = require("./routes/RegisterRoute");
const authRoutes = require("./routes/auth.routes");
const forgetAndReset = require("./routes/ForgetAndReset");
const createPostRoute = require("./routes/createPost.routes");
const viewPosts = require("./routes/ViewPostRoute");
const profilePageRoute = require("./routes/ProfilePageRoute");
const updateProfile = require("./routes/UpdateProfileRoute");
const search = require("./routes/SearchRoute");
const feed = require("./routes/FeedRoute");
const follow = require("./routes/FollowRoute");
const likeUnlike = require("./routes/LikeUnlikeRoute");
const comment = require("./routes/CommentRoute");
const dynamicProfile = require("./routes/DynamicProfileRoute");
const viewComments = require("./routes/ViewCommentRoute");

function createServer() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(bodyParser.json());

  // Static file serving
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Mount routes under /api
  app.use("/api", registerRoute);
  app.use("/api", authRoutes);
  app.use("/api", forgetAndReset);
  app.use("/api", createPostRoute);
  app.use("/api", viewPosts);
  app.use("/api", profilePageRoute);
  app.use("/api", updateProfile);
  app.use("/api", search);
  app.use("/api", feed);
  app.use("/api", follow);
  app.use("/api", likeUnlike);
  app.use("/api", comment);
  app.use("/api", dynamicProfile);
  app.use("/api", viewComments);

  return app;
}

// Start the server
if (require.main === module) {
  const app = createServer();
  app.listen(config.port, () =>
    console.log(`✅ Server is running on ${config.baseUrl}`)
  );
}

module.exports = createServer;
