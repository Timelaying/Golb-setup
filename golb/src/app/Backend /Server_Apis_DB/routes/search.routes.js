const express = require("express");
const router = express.Router();
const { searchUsersByUsername } = require("../models/users.model");

// GET /search?query=tim
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const users = await searchUsersByUsername(query);
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
