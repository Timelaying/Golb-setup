require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

router.get("/feed/:userId", async (req, res) => {
    let { userId } = req.params;

    // Check if userId is missing or invalid
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    userId = parseInt(userId, 10); // Convert to integer

    try {
        const posts = await pool.query(`
            SELECT posts.* FROM posts 
            JOIN followers ON posts.user_id = followers.following_id
            WHERE followers.follower_id = COALESCE($1, followers.follower_id)
            ORDER BY posts.created_at DESC
        `, [userId ? parseInt(userId, 10) : null]);

        res.json(posts.rows);
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ error: "Server error" });
    }
});

