// controllers/profile.controller.js

const { getUserProfile } = require("../models/users.model");
const { getFollowerStats } = require("../models/followers.model");
const path = require("path");
const { getUploadPathForUser } = require("../utils/uploads");
const { updateUserProfile } = require("../models/users.model");
const ERROR_CODES = require("../utils/errorCodes");

const handleGetProfile = async (req, res) => {
  const userId = req.user.id;

  const user = await getUserProfile(userId);
  if (!user) {
    const { code, message } = ERROR_CODES.USER_NOT_FOUND;
    return res.status(404).json({ code, message });
  }

  if (user.profile_picture) {
    user.profile_picture = `http://localhost:5000${user.profile_picture}`;
  }

  const stats = await getFollowerStats(userId);

  res.status(200).json({
    ...user,
    postCount: parseInt(stats.post_count, 10),
    followersCount: parseInt(stats.followers_count, 10),
    followingCount: parseInt(stats.following_count, 10),
  });
};

const handleProfileUpdate = async (req, res) => {
  const { userId, location, bio } = req.body;

  const profilePicturePath = req.file
    ? `/uploads/users/${req.usernameForFile}/${req.file.filename}`
    : null;

  const updatedUser = await updateUserProfile({
    userId,
    location,
    bio,
    profilePicture: profilePicturePath,
  });

  if (!updatedUser) {
    return res.status(404).json(errorCodes.USER_NOT_FOUND);
  }

  updatedUser.profile_picture = `http://localhost:5000${updatedUser.profile_picture}`;
  res.status(200).json(updatedUser);
};

module.exports = {
  handleGetProfile,
  handleProfileUpdate,
};
