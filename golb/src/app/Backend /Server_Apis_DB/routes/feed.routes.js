const express = require("express");
const router = express.Router();
const { getFeedForUser } = require("../models/posts.model");

// ✅ GET /feed/:userId
router.get("/feed/:userId", async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const feed = await getFeedForUser(userId, limit, offset); // 👈 Add limit & offset support
    res.status(200).json(feed);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
