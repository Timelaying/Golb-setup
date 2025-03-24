const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/AuthenticateMiddleware");

const {
  isFollowing,
  followUser,
  unfollowUser,
  getFollowersForUser,
} = require("../models/followers.model");

// Follow a user
router.post("/follow/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params;
  const followerId = req.user.id;

  if (parseInt(userId) === followerId) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
    const alreadyFollowing = await isFollowing(followerId, userId);
    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user." });
    }

    await followUser(followerId, userId);
    res.status(200).json({ message: "User followed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Unfollow a user
router.delete("/unfollow/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params;
  const followerId = req.user.id;

  try {
    const alreadyFollowing = await isFollowing(followerId, userId);
    if (!alreadyFollowing) {
      return res.status(400).json({ message: "You are not following this user." });
    }

    await unfollowUser(followerId, userId);
    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get followers of a user
router.get("/followers/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const followers = await getFollowersForUser(userId);
    res.status(200).json(followers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Check follow status
router.get("/following/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params;
  const followerId = req.user.id;

  try {
    const following = await isFollowing(followerId, userId);
    res.status(200).json({ isFollowing: following });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
