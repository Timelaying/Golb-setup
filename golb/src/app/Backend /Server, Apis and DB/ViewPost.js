const express = require("express");
const router = express.Router();
const authenticateToken = require("./AuthenticateMiddleware");
const pool = require("./db");

// Fetch posts for a specific user
router.get("/viewposts", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `authenticateToken` attaches user info to `req.user`

        // Fetch posts and count for the logged-in user
        const result = await pool.query(
            "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        const count = result.rowCount;

        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: result.rows,
            count,
        });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
