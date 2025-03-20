const express = require("express");
const router = express.Router();
const pool = require("./db"); // Import PostgreSQL pool

router.get("/users/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Fetching profile for username:", username); // Debug log

    const userResult = await pool.query(
      "SELECT id, name, username, bio, email FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      console.log("User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const postsResult = await pool.query(
      "SELECT id, title, content, image, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    console.log("User profile fetched successfully:", user);

    res.json({ ...user, posts: postsResult.rows });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
