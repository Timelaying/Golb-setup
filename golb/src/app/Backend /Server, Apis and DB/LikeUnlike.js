// /routes/likes.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

// Like a post
router.post("/like", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const existing = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ message: "Already liked" });
    }

    await pool.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
      [userId, postId]
    );

    const countRes = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.status(200).json({ likes: parseInt(countRes.rows[0].count) });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error" });
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

    const countRes = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.status(200).json({ likes: parseInt(countRes.rows[0].count) });
  } catch (err) {
    console.error("Unlike error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get like count for a post
router.get("/likes/:postId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [req.params.postId]
    );
    res.json({ likes: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching like count" });
  }
});

// Check if user has liked a post
router.get("/liked/:userId/:postId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2",
      [req.params.userId, req.params.postId]
    );
    res.json({ liked: result.rowCount > 0 });
  } catch (err) {
    res.status(500).json({ message: "Error checking like status" });
  }
});

module.exports = router;
