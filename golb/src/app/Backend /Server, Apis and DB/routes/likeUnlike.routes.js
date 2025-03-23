const express = require("express");
const router = express.Router();
const pool = require("../db");

// Like a post
router.post("/like", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const existing = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already liked" });
    }

    await pool.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
      [userId, postId]
    );

    const count = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.json({ likes: parseInt(count.rows[0].count, 10) });
  } catch (error) {
    console.error("Like error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Unlike a post
router.post("/unlike", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    await pool.query(
      "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    const count = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.json({ likes: parseInt(count.rows[0].count, 10) });
  } catch (error) {
    console.error("Unlike error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get total likes
router.get("/likes/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.json({ likes: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    console.error("Fetch like count error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if a user liked a post
router.get("/user-likes/:userId/:postId", async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const liked = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    res.json({ liked: liked.rows.length > 0 });
  } catch (error) {
    console.error("Check user like error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
