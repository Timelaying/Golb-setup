// routes/createPost.routes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const { createPost } = require("../models/posts.model");

router.post("/posts", authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    const userId = req.user.id;
    const post = await createPost({ userId, title, content });

    res.status(201).json({ message: "Post created successfully!", post });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
