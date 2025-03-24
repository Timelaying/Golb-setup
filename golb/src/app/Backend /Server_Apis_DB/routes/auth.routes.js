const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const { findUserByUsername, findUserById } = require("../models/users.model");
const pool = require("../db");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token.utils");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials." });

    const accessToken = generateAccessToken({ id: user.id, username: user.name });
    const refreshToken = generateRefreshToken({ id: user.id, username: user.name });

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required." });

  try {
    const result = await pool.query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken]);
    if (result.rows.length === 0) return res.status(403).json({ error: "Invalid refresh token." });

    const user = result.rows[0];
    const decoded = await verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({ id: user.id, username: user.name });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(403).json({ error: "Invalid or expired refresh token." });
  }
});
