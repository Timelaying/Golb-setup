// routes/viewPost.routes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");

const { handleFetchUserPosts } = require("../controllers/post.controller");

// ✅ Fetch posts by logged-in user
router.get("/viewposts", authenticateToken, handleFetchUserPosts);

module.exports = router;
