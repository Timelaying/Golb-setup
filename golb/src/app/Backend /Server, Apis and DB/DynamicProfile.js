const express = require("express");
const router = express.Router();
const pool = require("./db"); 
const authenticateToken = require("./AuthenticateMiddleware");

// Get user profile & posts
router.get("/users/:username", authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    const userId = req.user.id; // Logged-in user's ID

    // Fetch user details
    const userResult = await pool.query(
      `SELECT id, name, username, bio, email, profile_picture 
       FROM users WHERE username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // Fetch posts of the searched user
    const postsResult = await pool.query(
      `SELECT p.id, p.content, p.image, p.created_at,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = $1) > 0 AS liked
       FROM posts p
       WHERE p.user_id = $2
       ORDER BY p.created_at DESC`,
      [userId, user.id]
    );

    // Check if the logged-in user follows this profile
    const followResult = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2) AS is_following`,
      [userId, user.id]
    );

    user.profile_picture = user.profile_picture
      ? `http://localhost:5000${user.profile_picture}`
      : null;

    res.json({
      ...user,
      posts: postsResult.rows,
      isFollowing: followResult.rows[0].is_following,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like a post
router.post("/posts/:postId/like", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if already liked
    const checkLike = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    if (checkLike.rows.length > 0) {
      await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);
      return res.json({ liked: false });
    } else {
      await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [userId, postId]);
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Comment on a post
router.post("/posts/:postId/comment", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Comment cannot be empty" });

    await pool.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)",
      [userId, postId, content]
    );

    res.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Follow/unfollow user
router.post("/users/:userId/follow", authenticateToken, async (req, res) => {
  try {
    const { userId: followId } = req.params;
    const userId = req.user.id;

    if (userId == followId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const checkFollow = await pool.query(
      "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
      [userId, followId]
    );

    if (checkFollow.rows.length > 0) {
      await pool.query("DELETE FROM followers WHERE follower_id = $1 AND following_id = $2", [userId, followId]);
      return res.json({ isFollowing: false });
    } else {
      await pool.query("INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)", [userId, followId]);
      return res.json({ isFollowing: true });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
