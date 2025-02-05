require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

router.get("/feed/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await pool.query(`
            SELECT posts.* FROM posts 
            JOIN follows ON posts.user_id = follows.following_id
            WHERE follows.follower_id = $1
            ORDER BY posts.created_at DESC
        `, [userId]);

        res.json(posts.rows);
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ error: "Server error" });
    }
});
