const express = require("express");
const router = express.Router();
const {
  hasUserLikedPost,
  getLikesCount,
  likePost,
  unlikePost,
} = require("../models/likes.model");

// 👍 Like a post
router.post("/like", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const alreadyLiked = await hasUserLikedPost(userId, postId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked" });
    }

    await likePost(userId, postId);
    const likes = await getLikesCount(postId);

    res.json({ likes });
  } catch (error) {
    console.error("Like error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 👎 Unlike a post
router.post("/unlike", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    await unlikePost(userId, postId);
    const likes = await getLikesCount(postId);

    res.json({ likes });
  } catch (error) {
    console.error("Unlike error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔢 Get total likes for a post
router.get("/likes/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await getLikesCount(postId);
    res.json({ likes });
  } catch (error) {
    console.error("Fetch like count error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ❓ Check if user liked a post
router.get("/user-likes/:userId/:postId", async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const liked = await hasUserLikedPost(userId, postId);
    res.json({ liked });
  } catch (error) {
    console.error("Check user like error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
