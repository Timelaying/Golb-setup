// routes/viewComment.routes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const {
  getCommentsForPost,
  addComment
} = require("../models/comments.model");

// ✅ Fetch comments and nested replies
router.get("/viewcomments/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const flatComments = await getCommentsForPost(postId);

    // 🌳 Organize into tree structure
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      if (comment.parent_comment_id) {
        commentMap[comment.parent_comment_id]?.replies.push(comment);
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

    const newComment = await addComment(userId, postId, content, parentCommentId || null);

    res.status(200).json({
      message: "Comment added successfully!",
      comment: newComment,
    });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
