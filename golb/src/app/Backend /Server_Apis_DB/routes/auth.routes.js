// Environment variables for secrets
require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateToken = require("../middleware/AuthenticateMiddleware"); // inporting middleware for token refresh


router.get("/test", (req, res) => {
    res.send("Auth routes working");
  });
  



// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {// Checking for user in the database table
        const result = await pool.query("SELECT * FROM users WHERE name = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password); //checking for password

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Generate a JWT access token using ACCESS_TOKEN_SECRET
        const accessToken = jwt.sign(
            { id: user.id, username: user.name },
            process.env.ACCESS_TOKEN_SECRET, // Use access token secret
            { expiresIn: "1h" } // Access token expires in 1 hour
        );

        // Generate a JWT refresh token using REFRESH_TOKEN_SECRET
        const refreshToken = jwt.sign(
            { id: user.id, username: user.name },
            process.env.REFRESH_TOKEN_SECRET, // Use refresh token secret
            { expiresIn: "7d" } // Refresh token expires in 7 days
        );

        // Save the refresh token in the database (optional but recommended for invalidation)
        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
            refreshToken,
            user.id,
        ]);

        res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Example of a protected route
router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Access granted to protected route.", user: req.user });
});

// Route to refresh the access token using the refresh token
router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token is required." });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken]);

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Invalid refresh token." });
        }

        const user = result.rows[0];

        // Verify the refresh token using REFRESH_TOKEN_SECRET
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired refresh token." });
            }

            // Generate a new access token using ACCESS_TOKEN_SECRET
            const accessToken = jwt.sign(
                { id: user.id, username: user.name },
                process.env.ACCESS_TOKEN_SECRET, // Use access token secret
                { expiresIn: "1h" }
            );

            res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error("Error during token refresh:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Get current authenticated user
router.get("/current-user", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, username, email FROM users WHERE id = $1", [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Export the router to be used in the main app
module.exports = router;
