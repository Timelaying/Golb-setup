const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pool = require("./db");
const fs = require("fs");

// Serve static files for profile pictures
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { userId } = req.body;

    // Get the username using userId from the DB
    const userResult = await pool.query("SELECT username FROM users WHERE id = $1", [userId]);
    const username = userResult.rows[0]?.username;

    if (!username) return cb(new Error("User not found."), null);

    const userDir = path.join(__dirname, "uploads", "users", username);

    // Ensure directory exists
    fs.mkdirSync(userDir, { recursive: true });

    req.usernameForFile = username; // save for use in filename or DB update
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, "profile" + path.extname(file.originalname)); // always save as profile.jpg/png
  },
});

const upload = multer({ storage });

// Update Profile API
router.put("/update-profile", upload.single("profile_picture"), async (req, res) => {
    try {
        const { userId, location, bio } = req.body;
        let profilePictureUrl = null;

        if (req.file) {
            profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`;
        }

        // Update user profile in the database
        const updateQuery = `
            UPDATE users 
            SET location = $1, bio = $2, profile_picture = COALESCE($3, profile_picture)
            WHERE id = $4 
            RETURNING id, username, email, location, bio, profile_picture;
        `;

        const result = await pool.query(updateQuery, [
            location,
            bio,
            profilePictureUrl,
            userId,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        // Ensure Express serves the updated profile picture
        res.json({
            ...result.rows[0],
            profile_picture: `http://localhost:5000${result.rows[0].profile_picture}`, // Full URL
        });
        console.log("Updating user:", { userId, location, bio, profilePictureUrl });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
