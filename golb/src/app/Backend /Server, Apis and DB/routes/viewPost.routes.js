const express = require("express");
const router = express.Router();
const authenticateToken = require("./routes/AuthenticateMiddleware");
const pool = require("./db");

// Fetch posts for a specific user
router.get("/viewposts", authenticateToken, async (req, res) => {
    try {
        // Ensure req.user exists and has an ID
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const userId = req.user.id;

        const postsQuery = `
            SELECT posts.*, 
                   (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
                   (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count
            FROM posts
            WHERE posts.user_id = $1
            ORDER BY posts.created_at DESC
        `;

        // Debugging logs
        console.log(`Fetching posts for user ID: ${userId}`);

        const result = await pool.query(postsQuery, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: result.rows,
            count: result.rows.length,
        });
    } catch (err) {
        console.error("Error fetching posts:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
