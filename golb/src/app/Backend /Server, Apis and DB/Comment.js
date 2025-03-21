// /routes/comments.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

// Add a comment
router.post("/comment", async (req, res) => {
  const { userId, postId, content } = req.body;

  if (!userId || !postId || !content.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const insertRes = await pool.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, postId, content]
    );

    const fullComment = await pool.query(
      "SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.id = $1",
      [insertRes.rows[0].id]
    );

    res.status(201).json(fullComment.rows[0]);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get comments for a post
router.get("/comments/:postId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT comments.*, users.username 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE post_id = $1 
       ORDER BY created_at ASC`,
      [req.params.postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
