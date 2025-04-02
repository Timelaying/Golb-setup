const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const startServer = require("./startServer");

const { requestLogger } = require("./utils/logger") // ✅ Import request logger

// Import routes from the routes/ folder
const authRoutes = require("./routes/auth.routes"); console.log("✅ Auth route loaded");
const registerRoutes = require("./routes/register.routes");
const forgetResetRoutes = require("./routes/forgetReset.routes");
const createPostRoutes = require("./routes/createPost.routes");
const viewPostsRoutes = require("./routes/viewPosts.routes");
const profilePageRoutes = require("./routes/profilePage.routes");
const updateProfileRoutes = require("./routes/updateProfile.routes");
const searchRoutes = require("./routes/search.routes");
const feedRoutes = require("./routes/feed.routes");
const followRoutes = require("./routes/follow.routes");
const likeUnlikeRoutes = require("./routes/likeUnlike.routes");
const commentRoutes = require("./routes/comment.routes");
const dynamicProfileRoutes = require("./routes/dynamicProfile.routes");
const viewCommentRoutes = require("./routes/viewComment.routes");

const app = express();

// ✅ Logging middleware from utils
app.use(requestLogger);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api", authRoutes);
app.use("/api", registerRoutes);
app.use("/api", forgetResetRoutes);
app.use("/api", createPostRoutes);
app.use("/api", viewPostsRoutes);
app.use("/api", profilePageRoutes);
app.use("/api", updateProfileRoutes);
app.use("/api", searchRoutes);
app.use("/api", feedRoutes);
app.use("/api", followRoutes);
app.use("/api", likeUnlikeRoutes);
app.use("/api", commentRoutes);
app.use("/api", dynamicProfileRoutes);
app.use("/api", viewCommentRoutes);

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

// Start server
startServer(app, config.port);
