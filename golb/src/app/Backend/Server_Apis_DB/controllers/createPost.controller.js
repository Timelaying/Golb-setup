// controllers/createPost.controller.js
const { createPost } = require("../models/posts.model");
const errorCodes = require("../utils/errorCodes");

exports.handleCreatePost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const post = await createPost({ userId, title, content });
  res.status(201).json({ message: "Post created successfully!", post });
};
