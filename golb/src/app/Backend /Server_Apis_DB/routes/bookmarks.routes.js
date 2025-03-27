// routes/bookmarks.routes.js
const express = require("express");
const router = express.Router();
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../models/bookmarks.model");

// ✅ Add a bookmark
router.post("/bookmark", async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: "User ID and Post ID are required" });
  }

  try {
    const bookmark = await addBookmark(userId, postId);
    res.status(201).json(bookmark);
  } catch (err) {
    console.error("Error adding bookmark:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Remove a bookmark
router.delete("/bookmark", async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: "User ID and Post ID are required" });
  }

  try {
    const removed = await removeBookmark(userId, postId);
    res.status(200).json(removed);
  } catch (err) {
    console.error("Error removing bookmark:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all bookmarks for a user
router.get("/bookmarks/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const bookmarks = await getBookmarks(userId);
    res.status(200).json(bookmarks);
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
