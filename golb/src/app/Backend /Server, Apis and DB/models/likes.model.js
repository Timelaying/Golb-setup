const pool = require("../db");

async function hasUserLikedPost(userId, postId) {
  const res = await pool.query("SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);
  return res.rowCount > 0;
}

async function getLikesCount(postId) {
  const res = await pool.query("SELECT COUNT(*) FROM likes WHERE post_id = $1", [postId]);
  return parseInt(res.rows[0].count, 10);
}

async function likePost(userId, postId) {
  await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [userId, postId]);
}

async function unlikePost(userId, postId) {
  await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);
}

module.exports = {
  hasUserLikedPost,
  getLikesCount,
  likePost,
  unlikePost,
};
