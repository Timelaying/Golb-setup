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
