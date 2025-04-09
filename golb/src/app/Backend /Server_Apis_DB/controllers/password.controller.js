// controllers/password.controller.js
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { sendResetEmail } = require("../utils/email.util");
const { hashPassword } = require("../utils/hash.util");
const errorCodes = require("../utils/errorCodes");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userCheck.rows.length === 0) {
    return res.status(404).json(errorCodes.USER_NOT_FOUND);
  }

  const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  await sendResetEmail(email, resetLink);
  res.status(200).json({ message: "Password reset link sent to your email." });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const email = decoded.email;

  const hashedPassword = await hashPassword(newPassword);
  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

  res.status(200).json({ message: "Password has been reset successfully." });
};
