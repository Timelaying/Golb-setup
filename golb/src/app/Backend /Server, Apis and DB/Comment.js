// /routes/comments.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

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


// Get comments for a post
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const query = `
      SELECT comments.*, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC;
    `;
    const result = await pool.query(query, [postId]);

    const commentMap = {};
    const topLevelComments = [];

    result.rows.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      if (comment.parent_comment_id) {
        if (commentMap[comment.parent_comment_id]) {
          commentMap[comment.parent_comment_id].replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    res.status(200).json(topLevelComments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
