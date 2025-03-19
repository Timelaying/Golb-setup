const express = require("express");
const router = express.Router();
const authenticateToken = require("./AuthenticateMiddleware");
const pool = require("./db");

// Fetch comments and replies for a specific post
router.get("/viewcomments/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const commentsQuery = `
    SELECT comments.id, comments.user_id, comments.post_id, comments.content, 
           comments.parent_comment_id, comments.created_at, users.username 
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
      comment.replies = []; // Initialize an empty replies array
      commentMap[comment.id] = comment; // Store by ID

      if (comment.parent_comment_id) {
        // If it's a reply, push it under its parent
        if (commentMap[comment.parent_comment_id]) {
          commentMap[comment.parent_comment_id].replies.push(comment);
        }
      } else {
        // If it's a top-level comment, add to root
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

module.exports = router;
