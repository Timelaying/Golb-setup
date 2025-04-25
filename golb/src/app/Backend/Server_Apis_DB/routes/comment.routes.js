//routes/comment.routes.js 

const express = require("express");
const router = express.Router();
const {
  createComment,
  editComment,
  removeComment,
  fetchComments,
  replyToComment
} = require("../controllers/comments.controller");

// Add comment or reply
router.post("/comment", createComment);

// Edit comment
router.put("/comment/:commentId", editComment);

// Delete comment
router.delete("/comment/:commentId", removeComment);

// Get comments for a post
router.get("/comments/:postId", fetchComments);

// Reply to a comment
router.post("/reply", replyToComment);

module.exports = router;
