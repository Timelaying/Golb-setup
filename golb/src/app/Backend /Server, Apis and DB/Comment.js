const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get comments for a post
router.get("/comments/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await pool.query(
            "SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = $1 ORDER BY created_at DESC",
            [postId]
        );

        res.json(comments.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
});

// Add a new comment
router.post("/comment", async (req, res) => {
    const { userId, postId, content } = req.body;

    if (!content.trim()) {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    try {
        const newComment = await pool.query(
            "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *",
            [userId, postId, content]
        );

        res.json(newComment.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error adding comment" });
    }
});

module.exports = router;
