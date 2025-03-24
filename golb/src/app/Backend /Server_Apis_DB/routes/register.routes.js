require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const { findUserByUsername } = require("../models/users.model");
const { createUser } = require("../models/users.model");
const pool = require("../db");

// Setup email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Register endpoint
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if email already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(200).json({ message: "You are already registered!" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create user using model
    const newUser = await createUser({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // 📧 Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Welcome to Our Service!",
      text: `Hi ${newUser.name},\n\nThank you for registering on our platform. We are excited to have you on board!\n\nBest regards,\nYour Company`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.error("Email sending failed:", err.message);
    });

    res.status(201).json({
      message: "User registered successfully. A welcome email has been sent.",
      user: newUser,
    });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists." });
    }
    res.status(500).json({ error: "Failed to register user." });
  }
});

module.exports = router;
