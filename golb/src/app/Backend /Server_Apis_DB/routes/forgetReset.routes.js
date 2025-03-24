const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const { sendResetEmail } = require("../utils/email.util");
const { hashPassword } = require("../utils/hash.util");

// 👉 Request password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendResetEmail(email, resetLink);
    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 👉 Reset password with token
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const hashedPassword = await hashPassword(newPassword);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error during password reset:", error.message);
    res.status(500).json({ error: "Failed to reset password. Token might be invalid or expired." });
  }
});

module.exports = router;
