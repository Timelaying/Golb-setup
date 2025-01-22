const express = require("express");
const router = express.Router();
const authenticateToken = require("./authMiddleware");
const pool = require("./db");

router.post("/posts", authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required." });
    }

    try {
        const userId = req.user.id; // User data from token
        const result = await pool.query(
            "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, content, userId]
        );

        res.status(201).json({ message: "Post created successfully!", post: result.rows[0] });
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
