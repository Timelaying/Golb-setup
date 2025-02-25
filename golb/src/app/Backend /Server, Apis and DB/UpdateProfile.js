const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pool = require("./db");
const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only specific image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter,
});

// Route to update profile information
router.put("/update-profile", upload.single("profile_picture"), async (req, res) => {
  const { userId, location, bio } = req.body;
  const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const updateQuery = `
      UPDATE users SET 
        location = COALESCE($1, location), 
        bio = COALESCE($2, bio), 
        profile_picture = COALESCE($3, profile_picture)
      WHERE id = $4
      RETURNING id, name, username, email, location, bio, profile_picture;
    `;

    const result = await pool.query(updateQuery, [location, bio, profile_picture, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Profile updated successfully.", user: result.rows[0] });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

module.exports = router;
