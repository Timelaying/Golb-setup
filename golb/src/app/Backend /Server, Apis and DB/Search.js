require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

router.get("/search", async (req, res) => {
    const { query } = req.query;

    try {
        const posts = await pool.query(
            "SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1",
            [`%${query}%`]
        );
        res.json(posts.rows);
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
