const express = require("express");
const pool = require("../db");  // Ensure this points to your database connection
const router = express.Router();

// Like a post
router.post("/like", async (req, res) => {
    const { userId, postId } = req.body;
    
    try {
        await pool.query(
            "INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userId, postId]
        );
        res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error liking post" });
    }
});

// Unlike a post
router.delete("/unlike/:postId", async (req, res) => {
    const { userId } = req.body;  // User ID must be sent in the body
    const { postId } = req.params;

    try {
        await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);
        res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error unliking post" });
    }
});

module.exports = router;
