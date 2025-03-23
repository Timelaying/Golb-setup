const express = require("express");
const router = express.Router();
const authenticateToken = require("./AuthenticateMiddleware");
const pool = require("../db");

// ✅ Fetch comments and replies for a specific post with profile pictures
router.get("/viewcomments/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const commentsQuery = `
      SELECT comments.id, comments.user_id, comments.post_id, comments.content,
             comments.parent_comment_id, comments.created_at, users.username, users.profile_picture
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC
    `;

    const result = await pool.query(commentsQuery, [postId]);

    // Organize comments into a tree structure
    const commentMap = {};
    const rootComments = [];

    result.rows.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      if (comment.parent_comment_id) {
        if (commentMap[comment.parent_comment_id]) {
          commentMap[comment.parent_comment_id].replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    res.status(200).json({
      message: "Comments fetched successfully!",
      comments: rootComments,
    });
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ✅ Add comment or reply
router.post("/addcomment", authenticateToken, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const userId = req.user.id;

    if (!userId || !postId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const insertQuery = `
      INSERT INTO comments (user_id, post_id, content, parent_comment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [userId, postId, content, parentCommentId || null]);

    res.status(200).json({
      message: "Comment added successfully!",
      comment: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
