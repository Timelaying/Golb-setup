require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");

router.post("/comment", async (req, res) => {
    const { userId, postId, content } = req.body;

    try {
        await pool.query(
            "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)",
            [userId, postId, content]
        );
        res.json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
