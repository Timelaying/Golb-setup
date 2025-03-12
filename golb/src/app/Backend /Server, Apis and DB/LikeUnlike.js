const express = require("express");
const pool = require("../db");  // Ensure this points to your database connection
const router = express.Router();

// Like a post
// Get like count and user like status
router.get("/likes/:postId", async (req, res) => {
    const { postId } = req.params;
    const userId = req.query.userId; // Passed in query for checking if user liked

    try {
        const likeCountResult = await pool.query(
            "SELECT COUNT(*) FROM likes WHERE post_id = $1",
            [postId]
        );
        const likeCount = likeCountResult.rows[0].count;

        let likedByUser = false;
        if (userId) {
            const userLikeResult = await pool.query(
                "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
                [postId, userId]
            );
            likedByUser = userLikeResult.rows.length > 0;
        }

        res.json({ count: likeCount, likedByUser });
    } catch (error) {
        res.status(500).json({ error: "Error fetching likes" });
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
