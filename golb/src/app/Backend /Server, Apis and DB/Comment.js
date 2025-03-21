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
