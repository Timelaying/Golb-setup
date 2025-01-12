const express = require("express");
const router = express.Router(); // Create a router instance
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("..Database/db");

// Environment variables for JWT secret
require("dotenv").config();

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE name = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, username: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  
    if (!token) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user data to request object
      next();
    } catch (error) {
      res.status(403).json({ error: "Invalid or expired token." });
    }
  };
  
  // Example of a protected route
  router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Access granted to protected route.", user: req.user });
  });
  

// Export the router to be used in the main app
module.exports = router;
