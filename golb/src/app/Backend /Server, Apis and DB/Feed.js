const express = require("express");
const pool = require("./db");
const router = express.Router();

router.get("/feed/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // 1. Check if user is following anyone
    const followingRes = await pool.query(
      `SELECT following_id FROM followers WHERE follower_id = $1`,
      [userId]
    );

    const followingIds = followingRes.rows.map(row => row.following_id);

    // 2. Build dynamic query based on whether user follows anyone
    const followedPostsQuery = `
      SELECT 
        posts.*,
        users.username,
        users.name,
        users.profile_picture,
        COUNT(DISTINCT likes.id) AS likes_count,
        EXISTS (
          SELECT 1 FROM likes WHERE likes.user_id = $1 AND likes.post_id = posts.id
        ) AS is_liked_by_current_user
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON likes.post_id = posts.id
      WHERE posts.user_id = ANY($2::int[])
      GROUP BY posts.id, users.username, users.name, users.profile_picture
      ORDER BY posts.created_at DESC
      LIMIT 50
    `;

    const fallbackQuery = `
      SELECT 
        posts.*,
        users.username,
        users.name,
        users.profile_picture,
        COUNT(DISTINCT likes.id) AS likes_count,
        EXISTS (
          SELECT 1 FROM likes WHERE likes.user_id = $1 AND likes.post_id = posts.id
        ) AS is_liked_by_current_user
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON likes.post_id = posts.id
      GROUP BY posts.id, users.username, users.name, users.profile_picture
      ORDER BY likes_count DESC, posts.created_at DESC
      LIMIT 50
    `;

    const result = followingIds.length > 0
      ? await pool.query(followedPostsQuery, [userId, followingIds])
      : await pool.query(fallbackQuery, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
