const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing (if used during registration)
const pool = require("./db"); // Assuming your `db.js` file is set up correctly

const router = express.Router();

// Login endpoint
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = result.rows[0];

    // Check the password (if stored securely using bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Login successful
    res.status(200).json({ message: "Login successful!", user: { username } });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
