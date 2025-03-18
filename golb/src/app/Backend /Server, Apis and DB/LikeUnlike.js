const express = require("express");
const pool = require("./db"); // Your database connection
const router = express.Router();

// Like a post
router.post("/like", async (req, res) => {
    const { userId, postId } = req.body;

    try {
        // Check if the user has already liked the post
        const checkQuery = "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2";
        const checkResult = await pool.query(checkQuery, [userId, postId]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: "Already liked" });
        }

        // Insert like
        await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [userId, postId]);

        // Fetch updated like count
        const likeCountRes = await pool.query("SELECT COUNT(*) FROM likes WHERE post_id = $1", [postId]);

        res.status(201).json({ message: "Post liked", likes: parseInt(likeCountRes.rows[0].count, 10) });
    } catch (err) {
        console.error("Error liking post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Unlike a post
router.post("/unlike", async (req, res) => {
    const { userId, postId } = req.body;

    try {
        await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);

        // Fetch updated like count
        const likeCountRes = await pool.query("SELECT COUNT(*) FROM likes WHERE post_id = $1", [postId]);

        res.json({ message: "Post unliked", likes: parseInt(likeCountRes.rows[0].count, 10) });
    } catch (err) {
        console.error("Error unliking post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Get like count for a post
router.get("/likes/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
        const query = "SELECT COUNT(*) FROM likes WHERE post_id = $1";
        const result = await pool.query(query, [postId]);

        res.json({ postId, likes: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error("Error fetching like count:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Check if user has liked a post
router.get("/user-likes/:userId/:postId", async (req, res) => {
    const { userId, postId } = req.params;

    try {
        const query = "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2";
        const result = await pool.query(query, [userId, postId]);

        res.json({ liked: result.rows.length > 0 });
    } catch (err) {
        console.error("Error checking like status:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
