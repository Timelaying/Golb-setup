// /routes/comment.routes.js
const express = require("express");
const router = express.Router();
const {
  addComment,
  getNestedComments,
  updateComment,
  deleteComment,
} = require("../models/comments.model");

// ✅ Add a new comment or reply
router.post("/comment", async (req, res) => {
  const { userId, postId, content, parentCommentId = null } = req.body;

  if (!userId || !postId || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const comment = await addComment(userId, postId, content, parentCommentId);
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Edit a comment
router.put("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: "User ID and content are required." });
  }

  try {
    const updated = await updateComment(commentId, userId, content);

    if (!updated) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    res.status(200).json({ message: "Comment updated", comment: updated });
  } catch (err) {
    console.error("Error editing comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete comment
router.delete("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const deleted = await deleteComment(commentId, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Comment not found or unauthorized" });
    }
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get nested comments
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await getNestedComments(postId);
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
