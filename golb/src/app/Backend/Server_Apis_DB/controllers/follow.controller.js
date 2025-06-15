// controllers/follow.controller.js
const {
    isFollowing,
    followUser,
    unfollowUser,
    getFollowersForUser,
  } = require("../models/followers.model");
  
  const errorCodes = require("../utils/errorCodes");
  
  exports.handleFollow = async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user.id;
  
    if (parseInt(userId) === followerId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }
  
    const alreadyFollowing = await isFollowing(followerId, userId);
    if (alreadyFollowing) {
      return res.status(400).json({ error: "Already following this user." });
    }
  
    await followUser(followerId, userId);
    res.status(200).json({ message: "User followed successfully." });
  };
  
  exports.handleUnfollow = async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user.id;
  
    const alreadyFollowing = await isFollowing(followerId, userId);
    if (!alreadyFollowing) {
      return res.status(400).json(errorCodes.NOT_FOLLOWING);
    }
  
    await unfollowUser(followerId, userId);
    res.status(200).json({ message: "User unfollowed successfully." });
  };
  
  exports.checkFollowing = async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user.id;
  
    const following = await isFollowing(followerId, userId);
    res.status(200).json({ isFollowing: following });
  };
  
  exports.getFollowers = async (req, res) => {
    const { userId } = req.params;
    const followers = await getFollowersForUser(userId);
    res.status(200).json(followers);
  };
  