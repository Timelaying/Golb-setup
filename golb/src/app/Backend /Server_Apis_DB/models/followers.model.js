const pool = require("../db");

async function isFollowing(followerId, followingId) {
  const res = await pool.query(
    "SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId]
  );
  return res.rowCount > 0;
}

async function followUser(followerId, followingId) {
  return await pool.query(
    "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
    [followerId, followingId]
  );
}

async function unfollowUser(followerId, followingId) {
  return await pool.query(
    "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId]
  );
}

async function getFollowersForUser(userId) {
  const res = await pool.query(
    `SELECT users.id, users.username, users.profile_picture
     FROM followers 
     JOIN users ON followers.follower_id = users.id 
     WHERE followers.following_id = $1`,
    [userId]
  );
  return res.rows;
}

module.exports = {
  isFollowing,
  followUser,
  unfollowUser,
  getFollowersForUser,
};
