const express = require("express");
const router = express.Router();
const { getFeedForUser } = require("../models/posts.model");

// ✅ GET /feed/:userId
router.get("/feed/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const feed = await getFeedForUser(userId);
    res.status(200).json(feed);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
