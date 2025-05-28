// routes/createPost.routes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const { handleCreatePost } = require("../controllers/createPost.controller");

router.post("/posts", authenticateToken, handleCreatePost);

module.exports = router;
