require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("./db");
const authenticateUser = require("./AuthenticateMiddleware");

// Follow a user
router.post("/follow/:userId", authenticateUser, async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user.id; // Authenticated user ID

    if (parseInt(userId) === followerId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const existingFollow = await pool.query(
            "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
            [followerId, userId]
        );

        if (existingFollow.rows.length > 0) {
            return res.status(400).json({ message: "You are already following this user." });
        }

        await pool.query(
            "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
            [followerId, userId]
        );

        res.status(200).json({ message: "User followed successfully." });
        console.log(req.user.id, req.params.userId);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Unfollow a user
router.delete("/unfollow/:userId", authenticateUser, async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user.id;

    try {
        const existingFollow = await pool.query(
            "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
            [followerId, userId]
        );

        if (existingFollow.rows.length === 0) {
            return res.status(400).json({ message: "You are not following this user." });
        }

        await pool.query(
            "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
            [followerId, userId]
        );

        res.status(200).json({ message: "User unfollowed successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get followers of a user
router.get("/followers/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const followers = await pool.query(
            "SELECT users.id, users.username, users.profile_picture FROM followers JOIN users ON followers.follower_id = users.id WHERE followers.following_id = $1",
            [userId]
        );
        res.status(200).json(followers.rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get users a user is following
router.get("/following/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const following = await pool.query(
            "SELECT users.id, users.username, users.profile_picture FROM followers JOIN users ON followers.following_id = users.id WHERE followers.follower_id = $1",
            [userId]
        );
        res.status(200).json(following.rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;

