
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../Database/db');
const cors = require('cors');

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

  try { // insering values into the table
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );

    res.status(201).json({
      message: 'User registered successfully.',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Error inserting user:', err.message);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
