const express = require("express");
const router = express.Router();
const authenticateToken = require("./AuthenticateMiddleware");
const pool = require("./db");

// Fetch posts for a specific user
router.get("/viewposts", async (req, res) => {
    try {
        const postsQuery = `
            SELECT posts.*, 
                   (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
                   (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count
            FROM posts
            WHERE posts.user_id = $1
            ORDER BY posts.created_at DESC
        `;

        const result = await pool.query(postsQuery, [req.user.id]); // Assuming req.user.id is the owner
        res.json({ posts: result.rows, count: result.rows.length });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
