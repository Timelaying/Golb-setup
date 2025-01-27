// Backend: Express route for profile data
const express = require("express");
const router = express.Router();
const pool = require("./db"); // Assuming you have a PostgreSQL connection pool
const authenticateToken = require("./middleware/authenticateToken"); // Middleware to verify JWT

// Profile API
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated token

    // Fetch user data
    const userResult = await pool.query(
      "SELECT id, full_name, username, email, location, bio, profile_picture FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userResult.rows[0];

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
