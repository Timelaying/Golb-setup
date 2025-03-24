const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");

const { getUserProfile } = require("../models/users.model");
const { getFollowerStats } = require("../models/followers.model");

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserProfile(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Format profile picture URL
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
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
