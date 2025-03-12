const express = require("express");
const pool = require("../db"); // Import your PostgreSQL connection
const router = express.Router();

// ✅ Add a comment
router.post("/comment", async (req, res) => {
  const { userId, postId, content } = req.body;

  if (!userId || !postId || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query = "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(query, [userId, postId, content]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all comments for a post
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const query = `
      SELECT comments.*, users.username 
      FROM comments 
      JOIN users ON comments.user_id = users.id
      WHERE post_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [postId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ (Optional) Delete a comment
router.delete("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);
    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
