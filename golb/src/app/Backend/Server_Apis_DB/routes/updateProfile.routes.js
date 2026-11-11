// routes/updateProfile.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { getUploadPathForUser } = require("../utils/uploads");
const { handleProfileUpdate } = require("../controllers/profile.controller");
const { blobEnabled } = require("../utils/blobStorage");

// Multer storage config
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

// With Blob configured, keep the upload in memory and send it to Blob in the controller.
const upload = multer({
  storage: blobEnabled() ? multer.memoryStorage() : storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Profile update route
router.put("/update-profile", upload.single("profile_picture"), handleProfileUpdate);

module.exports = router;
