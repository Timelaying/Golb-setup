const express = require("express");
const router = express.Router();
const pool = require("./db");
const authenticateToken = require("./AuthenticateMiddleware");

// Fetch user profile with posts, likes, comments, and follow status
router.get("/users/:username", authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    const userId = req.user.id; // Logged-in user ID

    // Fetch user details
    const userQuery = `
      SELECT id, name, username, bio, email, profile_picture 
      FROM users WHERE username = $1
    `;
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // Fetch user's posts with like & comment count
    const postsQuery = `
      SELECT p.id, p.title, p.content, p.image, p.created_at,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
      FROM posts p
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    const postsResult = await pool.query(postsQuery, [user.id]);

    // Check if the logged-in user follows this profile
    const followQuery = `
      SELECT COUNT(*) AS is_following
      FROM followers WHERE follower_id = $1 AND following_id = $2
    `;
    const followResult = await pool.query(followQuery, [userId, user.id]);
    const isFollowing = followResult.rows[0].is_following > 0;

    res.json({
      ...user,
      posts: postsResult.rows,
      isFollowing,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Follow a user
router.post("/follow/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    if (followerId == userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    await pool.query(
      "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [followerId, userId]
    );

    res.json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Unfollow a user
router.post("/unfollow/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    await pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
      [followerId, userId]
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
