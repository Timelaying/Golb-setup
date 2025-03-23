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
    "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
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

module.exports = {
  findUserById,
  findUserByUsername,
  createUser,
  updateUserProfile,
};
