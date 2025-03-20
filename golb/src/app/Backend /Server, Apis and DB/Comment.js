const express = require("express");
const pool = require("./db"); // Import your PostgreSQL connection
const router = express.Router();

// ✅ Add a comment (supports parentCommentId for replies)
router.post("/comment", async (req, res) => {
  const { userId, postId, content, parentCommentId } = req.body;

  if (!userId || !postId || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // If parentCommentId is provided, ensure it exists
    if (parentCommentId) {
      const parentCheck = await pool.query("SELECT id FROM comments WHERE id = $1", [parentCommentId]);
      if (parentCheck.rowCount === 0) {
        return res.status(400).json({ message: "Parent comment does not exist." });
      }
    }

    const query = `
      INSERT INTO comments (user_id, post_id, content, parent_comment_id) 
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [userId, postId, content, parentCommentId || null]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

// ✅ Get all comments for a post (returns structured nested comments)
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const query = `
      SELECT c.id, c.content, c.created_at, c.parent_comment_id, u.username 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.parent_comment_id NULLS FIRST, c.created_at DESC;
    `;
    
    const result = await pool.query(query, [postId]);

    // Convert flat list to a nested structure
    const comments = result.rows;
    const commentMap = {};

    // First, map all comments by ID
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    // Then, nest replies under their parents
    const structuredComments = [];
    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        // Attach the reply to its parent
        commentMap[comment.parent_comment_id]?.replies.push(comment);
      } else {
        // Top-level comment
        structuredComments.push(comment);
      }
    });

    res.json(structuredComments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

// ✅ Delete a comment
router.delete("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);
    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

module.exports = router;
