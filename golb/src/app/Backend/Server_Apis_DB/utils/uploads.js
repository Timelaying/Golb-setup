// utils/uploads.js
const fs = require("fs");
const path = require("path");
const { getUsernameById } = require("../models/users.model");

async function getUploadPathForUser(userId) {
  const username = await getUsernameById(userId);
  if (!username) throw new Error("User not found.");

  const userDir = path.join(__dirname, "..", "uploads", "users", username);
  fs.mkdirSync(userDir, { recursive: true });

  return { uploadPath: userDir, username };
}

module.exports = { getUploadPathForUser };
