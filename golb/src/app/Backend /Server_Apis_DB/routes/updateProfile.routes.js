const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getUploadPathForUser } = require("../utils/uploads");
const { updateUserProfile } = require("../models/users.model");

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { uploadPath, username } = await getUploadPathForUser(req.body.userId);
      req.usernameForFile = username;
      cb(null, uploadPath);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, "profile" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Route to update user profile
router.put("/update-profile", upload.single("profile_picture"), async (req, res) => {
  try {
    const { userId, location, bio } = req.body;
    const profilePicturePath = req.file
      ? `/uploads/users/${req.usernameForFile}/${req.file.filename}`
      : null;

    const updatedUser = await updateUserProfile({
      userId,
      location,
      bio,
      profilePicture: profilePicturePath,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    updatedUser.profile_picture = `http://localhost:5000${updatedUser.profile_picture}`;
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
