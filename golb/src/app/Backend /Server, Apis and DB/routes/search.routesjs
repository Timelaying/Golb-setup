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
        const users = await pool.query(
            "SELECT id, name, username, profile_picture FROM users WHERE username ILIKE $1",
            [`%${query}%`]
        );
        res.json(users.rows);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
