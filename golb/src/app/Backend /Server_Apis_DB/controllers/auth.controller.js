// controllers/auth.controller.js
const bcrypt = require("bcrypt");
const {
  findUserByUsername,
  findUserById,
} = require("../models/users.model");
const pool = require("../db");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token.utils");
const ERROR = require("../utils/errorCodes");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) throw { status: 404, ...ERROR.USER_NOT_FOUND };

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw { status: 401, error: "Invalid credentials." };

  const accessToken = generateAccessToken({ id: user.id, username: user.name });
  const refreshToken = generateRefreshToken({ id: user.id, username: user.name });

  await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [refreshToken, user.id]);

  res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
};

exports.getProtected = (req, res) => {
  res.status(200).json({ message: "Access granted to protected route.", user: req.user });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw { status: 401, error: "Refresh token required." };

  const result = await pool.query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken]);
  if (result.rows.length === 0) throw { status: 403, error: "Invalid refresh token." };

  const user = result.rows[0];
  await verifyRefreshToken(refreshToken); // throws if invalid
  const newAccessToken = generateAccessToken({ id: user.id, username: user.name });

  res.status(200).json({ accessToken: newAccessToken });
};

exports.getCurrentUser = async (req, res) => {
  const user = await findUserById(req.user.id);
  if (!user) throw { status: 404, ...ERROR.USER_NOT_FOUND };

  const { id, name, username, email } = user;
  res.status(200).json({ id, name, username, email });
};
