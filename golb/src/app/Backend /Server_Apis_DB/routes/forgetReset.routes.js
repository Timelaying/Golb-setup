const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("../db");
require("dotenv").config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to initiate password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send the reset link via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Hi,\n\nClick on the link below to reset your password:\n${resetLink}\n\nThis link will expire in 15 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send reset email." });
      }
      console.log("Email sent:", info.response);
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Route to reset the password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error during password reset:", error.message);
    res.status(500).json({ error: "Failed to reset password. Token might be invalid or expired." });
  }
});

module.exports = router;
