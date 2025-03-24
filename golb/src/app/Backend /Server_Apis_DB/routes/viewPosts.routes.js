const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const { getPostsWithCountsByUser } = require("../models/posts.model");

router.get("/viewposts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: No user ID" });

    const posts = await getPostsWithCountsByUser(userId);

    res.status(200).json({
      message: "Posts fetched successfully!",
      posts,
      count: posts.length,
    });
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
