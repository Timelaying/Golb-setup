const pool = require("../db");

async function isFollowing(followerId, followingId) {
  const res = await pool.query(
    "SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId]
  );
  return res.rowCount > 0;
}

async function followUser(followerId, followingId) {
  await pool.query(
    "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
    [followerId, followingId]
  );
}

async function unfollowUser(followerId, followingId) {
  await pool.query(
    "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId]
  );
}

module.exports = {
  isFollowing,
  followUser,
  unfollowUser,
};
