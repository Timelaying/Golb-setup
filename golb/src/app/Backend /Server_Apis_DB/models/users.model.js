let db = require("../db");

function setDb(mockDb) {
  db = mockDb;
}

// Detect whether we're using pg-promise or pg, to detect if it is test or real envirnonment 
function isPgPromise() {
  return typeof db.any === "function";
}

// Find user by ID
async function findUserById(id) {
  const result = isPgPromise()
    ? await db.any("SELECT * FROM users WHERE id = $1", [id])
    : await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result[0] || result.rows?.[0];
}

// Find user by username
async function findUserByUsername(username) {
  const result = isPgPromise()
    ? await db.any("SELECT * FROM users WHERE username = $1", [username])
    : await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return result[0] || result.rows?.[0];
}

// Create a new user
async function createUser({ name, username, email, password }) {
  const result = isPgPromise()
    ? await db.any(
        "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email, created_at",
        [name, username, email, password]
      )
    : await db.query(
        "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email, created_at",
        [name, username, email, password]
      );
  return result[0] || result.rows?.[0];
}

async function updateUserProfile({ userId, location, bio, profilePicture }) {
  const result = isPgPromise()
    ? await db.any(
        `UPDATE users 
         SET location = $1, bio = $2, profile_picture = COALESCE($3, profile_picture) 
         WHERE id = $4 RETURNING *`,
        [location, bio, profilePicture, userId]
      )
    : await db.query(
        `UPDATE users 
         SET location = $1, bio = $2, profile_picture = COALESCE($3, profile_picture) 
         WHERE id = $4 RETURNING *`,
        [location, bio, profilePicture, userId]
      );
  return result[0] || result.rows?.[0];
}

async function getUserProfile(userId) {
  const result = isPgPromise()
    ? await db.any(
        `SELECT id, name, username, email, location, bio, profile_picture 
         FROM users 
         WHERE id = $1`,
        [userId]
      )
    : await db.query(
        `SELECT id, name, username, email, location, bio, profile_picture 
         FROM users 
         WHERE id = $1`,
        [userId]
      );
  return result[0] || result.rows?.[0];
}

async function getUserProfileWithStats(username) {
  const userResult = isPgPromise()
    ? await db.any("SELECT id, name, username, bio, email, profile_picture FROM users WHERE username = $1", [username])
    : await db.query("SELECT id, name, username, bio, email, profile_picture FROM users WHERE username = $1", [username]);

  const user = userResult[0] || userResult.rows?.[0];
  if (!user) return null;

  const [followers, following] = await Promise.all([
    isPgPromise()
      ? db.any("SELECT COUNT(*) AS count FROM followers WHERE following_id = $1", [user.id])
      : db.query("SELECT COUNT(*) AS count FROM followers WHERE following_id = $1", [user.id]),
    isPgPromise()
      ? db.any("SELECT COUNT(*) AS count FROM followers WHERE follower_id = $1", [user.id])
      : db.query("SELECT COUNT(*) AS count FROM followers WHERE follower_id = $1", [user.id]),
  ]);

  const followersCount = parseInt((followers[0] || followers.rows?.[0])?.count, 10);
  const followingCount = parseInt((following[0] || following.rows?.[0])?.count, 10);

  return {
    ...user,
    followersCount,
    followingCount,
  };
}

async function searchUsersByUsername(query) {
  const result = isPgPromise()
    ? await db.any("SELECT id, name, username, profile_picture FROM users WHERE username ILIKE $1", [`%${query}%`])
    : await db.query("SELECT id, name, username, profile_picture FROM users WHERE username ILIKE $1", [`%${query}%`]);
  return result || result.rows;
}

async function getUsernameById(userId) {
  const result = isPgPromise()
    ? await db.any("SELECT username FROM users WHERE id = $1", [userId])
    : await db.query("SELECT username FROM users WHERE id = $1", [userId]);
  const row = result[0] || result.rows?.[0];
  return row?.username;
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
  setDb,
};
