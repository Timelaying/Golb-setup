// controllers/dynamicProfile.controller.js
const { getUserProfileWithStats } = require("../models/users.model");
const { getUserPosts } = require("../models/posts.model");
const errorCodes = require("../utils/errorCodes");

exports.getUserProfileAndPosts = async (req, res) => {
  const { username } = req.params;

  const user = await getUserProfileWithStats(username);
  if (!user) {
    return res.status(404).json(errorCodes.USER_NOT_FOUND);
  }

  const posts = await getUserPosts(user.id);
  res.status(200).json({ ...user, posts });
};
