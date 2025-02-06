require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");


router.post("/like", async (req, res) => {
    const { userId, postId } = req.body;

    try {
        const checkLike = await pool.query(
            "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
            [userId, postId]
        );

        if (checkLike.rows.length > 0) {
            await pool.query(
                "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
                [userId, postId]
            );
            return res.json({ message: "Unliked post" });
        } else {
            await pool.query(
                "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
                [userId, postId]
            );
            return res.json({ message: "Liked post" });
        }
    } catch (error) {
        console.error("Like/unlike error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
