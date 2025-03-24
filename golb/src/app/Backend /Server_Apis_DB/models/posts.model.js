const pool = require("../db");

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

module.exports = {
  getPostsByUser,
  createPost,
};
