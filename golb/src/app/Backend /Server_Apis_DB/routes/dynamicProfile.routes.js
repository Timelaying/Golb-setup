// routes/dynamicProfile.routes.js
const express = require("express");
const router = express.Router();
const { getUserProfileWithStats } = require("../models/users.model");
const { getUserPosts } = require("../models/posts.model");

router.get("/users/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await getUserProfileWithStats(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await getUserPosts(user.id);

    res.json({ ...user, posts });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
