// Environment variables for JWT secrets
require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../Database/db");



// Route to handle form submission
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; // Expecting these fields from the form
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    try {
      // Hash the password before storing it
      const saltRounds = 10; // The cost factor (higher is more secure but slower)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Insert the user into the database with the hashed password
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      );
  
      res.status(201).json({
        message: 'User registered successfully.',
        user: result.rows[0],
      });
    } catch (err) {
      console.error('Error inserting user:', err.message);
  
      // Handle unique constraint violation (e.g., duplicate email)
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already exists.' });
      }
  
      res.status(500).json({ error: 'Failed to register user.' });
    }
  });

  // Export the router to be used in the main app
module.exports = router;