const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../Database/db');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt
const authRoutes = require("./authRoutes"); // Import the router module

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle form submission
app.post('/api/register', async (req, res) => {
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

// Mount the auth routes on the `/api` path
app.use("/api", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
