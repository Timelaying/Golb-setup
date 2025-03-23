require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

// Email configuration using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User registration route
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(200).json({ message: "You are already registered!" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const result = await pool.query(
      "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email, created_at",
      [name, username, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Welcome to Our Service!",
      text: `Hi ${newUser.name},\n\nThank you for registering on our platform. We are excited to have you on board!\n\nBest regards,\nYour Company`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
      }
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
