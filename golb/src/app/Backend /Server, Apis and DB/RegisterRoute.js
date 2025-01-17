// Environment variables for JWT secrets
require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // For sending emails
const pool = require("./db");

// Email configuration using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // You can replace this with another service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Route to handle form submission
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // Expecting these fields from the form

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userCheck.rows.length > 0) {
      return res.status(200).json({ message: "You are already registered!" });
    }

    // Hash the password before storing it
    const saltRounds = 10; // The cost factor (higher is more secure but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the database with the hashed password
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Send a welcome email to the new user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Welcome to Our Service!",
      text: `Hi ${newUser.name},\n\nThank you for registering on our platform. We are excited to have you on board!\n\nBest regards,\nYour Company`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "User registered successfully. A welcome email has been sent.",
      user: newUser,
    });
  } catch (err) {
    console.error("Error inserting user:", err.message);

    // Handle unique constraint violation (e.g., duplicate email)
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists." });
    }

    res.status(500).json({ error: "Failed to register user." });
  }
});

// Export the router to be used in the main app
module.exports = router;
