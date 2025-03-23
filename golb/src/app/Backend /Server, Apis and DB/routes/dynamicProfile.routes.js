
// backend route: DynamicProfile.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

router.get("/users/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const userResult = await pool.query(
      "SELECT id, name, username, bio, email, profile_picture FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const postsResult = await pool.query(
      "SELECT id, title, content, image, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    // Fetch followers and following counts
    const followersCount = await pool.query(
      "SELECT COUNT(*) FROM followers WHERE following_id = $1",
      [user.id]
    );
    const followingCount = await pool.query(
      "SELECT COUNT(*) FROM followers WHERE follower_id = $1",
      [user.id]
    );

    res.json({
      ...user,
      posts: postsResult.rows,
      followersCount: parseInt(followersCount.rows[0].count, 10),
      followingCount: parseInt(followingCount.rows[0].count, 10),
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
