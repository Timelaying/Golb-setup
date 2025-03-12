const express = require("express");
const router = express.Router();
const pool = require("../db");

// Like a post
router.post("/like", async (req, res) => {
  const { user_id, post_id } = req.body;
  try {
    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [user_id, post_id]
    );

    if (existingLike.rows.length > 0) {
      // Unlike if already liked
      await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [
        user_id,
        post_id,
      ]);
      return res.json({ message: "Post unliked" });
    }

    // Like the post
    await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [
      user_id,
      post_id,
    ]);
    res.json({ message: "Post liked" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total likes for a post
router.get("/likes/:post_id", async (req, res) => {
  const { post_id } = req.params;
  try {
    const likesCount = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [post_id]
    );
    res.json({ likes: parseInt(likesCount.rows[0].count) });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if a user liked a post
router.get("/liked/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  try {
    const liked = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [user_id, post_id]
    );
    res.json({ liked: liked.rows.length > 0 });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
