const pool = require("../config/db");

async function getPostsByUser(userId, options = { orderBy: "created_at", sort: "DESC" }) {
  const { orderBy, sort } = options;
  const result = await pool.query(
    `SELECT * FROM posts WHERE user_id = $1 ORDER BY ${orderBy} ${sort}`,
    [userId]
  );
  return result.rows;
}

async function createPost(userId, title, content, image = null) {
  const result = await pool.query(
    `INSERT INTO posts (user_id, title, content, image) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, title, content, image]
  );
  return result.rows[0];
}

module.exports = {
  getPostsByUser,
  createPost,
};
