const pool = require("../db");

// Find user by ID
async function findUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

// Find user by username
async function findUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
}

// Create a new user
async function createUser({ name, username, email, password }) {
  const result = await pool.query(
    "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email, created_at",
    [name, username, email, password]
  );
  return result.rows[0];
}


async function updateUserProfile({ userId, location, bio, profilePicture }) {
  const result = await pool.query(
    `UPDATE users 
       SET location = $1, bio = $2, profile_picture = COALESCE($3, profile_picture) 
       WHERE id = $4 RETURNING *`,
    [location, bio, profilePicture, userId]
  );
  return result.rows[0];
}

async function getUserProfile(userId) {
  const result = await pool.query(
    `SELECT id, name, username, email, location, bio, profile_picture 
     FROM users 
     WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function getUserProfileWithStats(username) {
  const userResult = await pool.query(
    "SELECT id, name, username, bio, email, profile_picture FROM users WHERE username = $1",
    [username]
  );

  if (userResult.rows.length === 0) return null;

  const user = userResult.rows[0];

  const [followers, following] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM followers WHERE following_id = $1", [user.id]),
    pool.query("SELECT COUNT(*) FROM followers WHERE follower_id = $1", [user.id]),
  ]);

  return {
    ...user,
    followersCount: parseInt(followers.rows[0].count, 10),
    followingCount: parseInt(following.rows[0].count, 10),
  };
}

async function searchUsersByUsername(query) {
  const result = await pool.query(
    "SELECT id, name, username, profile_picture FROM users WHERE username ILIKE $1",
    [`%${query}%`]
  );
  return result.rows;
}

// Get username by userId (for profile image upload)
async function getUsernameById(userId) {
  const result = await pool.query("SELECT username FROM users WHERE id = $1", [userId]);
  return result.rows[0]?.username;
}


module.exports = {
  findUserById,
  findUserByUsername,
  createUser,
  updateUserProfile,
  getUserProfile,
  getUserProfileWithStats,
  searchUsersByUsername,
  getUsernameById,
};
