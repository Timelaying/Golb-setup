// /routes/comments.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Add a comment
router.post("/comment", async (req, res) => {
  const { userId, postId, content, parentCommentId = null } = req.body;

  if (!userId || !postId || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query = `
      INSERT INTO comments (user_id, post_id, content, parent_comment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, postId, content, parentCommentId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Reply to a comment
router.post("/reply", async (req, res) => {
  const { userId, postId, content, parentCommentId } = req.body;

  if (!userId || !postId || !content || !parentCommentId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query = `
      INSERT INTO comments (user_id, post_id, content, parent_comment_id)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await pool.query(query, [userId, postId, content, parentCommentId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error posting reply:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Edit a comment
router.put("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: "User ID and content are required" });
  }

  try {
    // Ensure comment belongs to the user before allowing update
    const checkQuery = `
      SELECT * FROM comments WHERE id = $1 AND user_id = $2
    `;
    const check = await pool.query(checkQuery, [commentId, userId]);

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    const updateQuery = `
      UPDATE comments SET content = $1 WHERE id = $2 RETURNING *
    `;
    const result = await pool.query(updateQuery, [content, commentId]);

    res.status(200).json({ message: "Comment updated", comment: result.rows[0] });
  } catch (err) {
    console.error("Error editing comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete a comment
router.delete("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    const result = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [commentId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Get all comments and nested replies for a post
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const query = `
      SELECT comments.id, comments.content, comments.created_at, 
             comments.parent_comment_id, users.username, users.id AS user_id
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC;
    `;

    const result = await pool.query(query, [postId]);
    const flatComments = result.rows;

    // 🌳 Build tree
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      if (comment.parent_comment_id) {
        commentMap[comment.parent_comment_id]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    res.json(rootComments);
  } catch (err) {
    console.error("Error fetching nested comments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
