const express = require("express");
const router = express.Router();
const pool = require("./db");
const authenticateToken = require("./AuthenticateMiddleware");

// Profile API: Fetch user data
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token

    // Fetch user details
    const userResult = await pool.query(
      `SELECT id, name, username, email, location, bio, profile_picture 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    let user = userResult.rows[0];

    // Ensure the profile picture is served with a full URL
    if (user.profile_picture) {
      user.profile_picture = `http://localhost:5000${user.profile_picture}`;
    }

    // Fetch user stats
    const statsResult = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM posts WHERE user_id = $1) AS post_count,
        (SELECT COUNT(*) FROM followers WHERE following_id = $1) AS followers_count,
        (SELECT COUNT(*) FROM followers WHERE follower_id = $1) AS following_count`,
      [userId]
    );

    const stats = statsResult.rows[0];

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
