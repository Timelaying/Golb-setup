const express = require("express");
const pool = require("../db");
const router = express.Router();

// Add a comment
router.post("/comment", async (req, res) => {
    const { userId, postId, content } = req.body;

    try {
        await pool.query(
            "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)",
            [userId, postId, content]
        );
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding comment" });
    }
});

// Fetch all comments for a post
router.get("/comments/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
        const result = await pool.query(
            "SELECT c.id, c.content, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at DESC",
            [postId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
});

module.exports = router;
