// controllers/post.controller.js
const { getPostsWithCountsByUser } = require("../models/posts.model");
const errorCodes = require("../utils/errorCodes");

exports.handleFetchUserPosts = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json(errorCodes.INVALID_TOKEN);
  }

  const posts = await getPostsWithCountsByUser(userId);

  res.status(200).json({
    message: "Posts fetched successfully!",
    posts,
    count: posts.length,
  });
};
