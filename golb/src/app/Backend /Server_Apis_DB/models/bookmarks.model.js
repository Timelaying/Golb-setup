// models/bookmarks.model.js
const pool = require("../db");

// Add bookmark
async function addBookmark(userId, postId) {
  const query = `
    INSERT INTO bookmarks (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, postId]);
  return result.rows[0];
}

// Remove bookmark
async function removeBookmark(userId, postId) {
  const query = `
    DELETE FROM bookmarks
    WHERE user_id = $1 AND post_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, postId]);
  return result.rows[0];
}

// Get all bookmarks for a user
async function getBookmarks(userId) {
  const query = `
    SELECT posts.*,
           users.username,
           users.profile_picture
    FROM bookmarks
    JOIN posts ON bookmarks.post_id = posts.id
    JOIN users ON posts.user_id = users.id
    WHERE bookmarks.user_id = $1
    ORDER BY bookmarks.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
};


