require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

router.post("/follow", async (req, res) => {
    const { followerId, followingId } = req.body;

    try {
        const checkFollow = await pool.query(
            "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
            [followerId, followingId]
        );

        if (checkFollow.rows.length > 0) {
            await pool.query(
                "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
                [followerId, followingId]
            );
            return res.json({ message: "Unfollowed successfully" });
        } else {
            await pool.query(
                "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)",
                [followerId, followingId]
            );
            return res.json({ message: "Followed successfully" });
        }
    } catch (error) {
        console.error("Follow/unfollow error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
