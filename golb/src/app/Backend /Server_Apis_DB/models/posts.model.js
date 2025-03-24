const pool = require("../db");


async function getUserPosts(userId) {
  const result = await pool.query(
    "SELECT id, title, content, image, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

async function getPostsByUser(userId, options = { orderBy: "created_at", sort: "DESC" }) {
  const { orderBy, sort } = options;
  const result = await pool.query(
    `SELECT * FROM posts WHERE user_id = $1 ORDER BY ${orderBy} ${sort}`,
    [userId]
  );
  return result.rows;
}

// Create a post
async function createPost({ userId, title, content }) {
  const result = await pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, userId]
  );
  return result.rows[0];
}

// Fetch posts for feed (either followed or trending)
async function getFeedForUser(userId) {
  // Step 1: Who are they following?
  const followingRes = await pool.query(
    `SELECT following_id FROM followers WHERE follower_id = $1`,
    [userId]
  );

  const followingIds = followingRes.rows.map(row => row.following_id);

  // Step 2: Followed feed
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
    GROUP BY posts.id, users.id
    ORDER BY posts.created_at DESC
    LIMIT 50;
  `;

  // Step 3: Fallback feed
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
    GROUP BY posts.id, users.id
    ORDER BY likes_count DESC, posts.created_at DESC
    LIMIT 50;
  `;

  const result = followingIds.length > 0
    ? await pool.query(followedPostsQuery, [userId, followingIds])
    : await pool.query(fallbackQuery, [userId]);

  return result.rows;
}

module.exports = {
  getUserPosts,
  getPostsByUser,
  createPost,
  getFeedForUser,
};
