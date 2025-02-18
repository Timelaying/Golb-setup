const express = require("express");
const router = express.Router();
const pool = require("./db"); // Import PostgreSQL pool

router.get("/api/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Query database for user
    const result = await pool.query("SELECT full_name, username, bio, email FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]); // Return user data
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;