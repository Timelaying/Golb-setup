// routes/viewComment.routes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");

const {
  handleFetchComments,
  handleAddComment,
} = require("../controllers/viewComment.controller");

// ✅ Fetch nested comments
router.get("/viewcomments/:postId", authenticateToken, handleFetchComments);

// ✅ Add comment or reply
router.post("/addcomment", authenticateToken, handleAddComment);

module.exports = router;
