// auth.routes.js
require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/AuthenticateMiddleware");

// ✅ Import user model
const {
  findUserByUsername,
  findUserById
} = require("../models/users.model");


const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token.utils");

const pool = require("../db");

router.get("/test", (req, res) => {
  res.send("Auth routes working");
});

// ✅ Login route
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

// ✅ Protected route example
router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Access granted to protected route.", user: req.user });
});

// ✅ Refresh token
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

// ✅ Get current authenticated user
router.get("/current-user", authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { id, name, username, email } = user;
    res.status(200).json({ id, name, username, email });
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
