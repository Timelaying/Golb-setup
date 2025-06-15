// routes/likeUnlike.routes.js
const express = require("express");
const router = express.Router();

const {
  like,
  unlike,
  getLikes,
  checkUserLike,
} = require("../controllers/likes.controller");

router.post("/like", like);
router.post("/unlike", unlike);
router.get("/likes/:postId", getLikes);
router.get("/user-likes/:userId/:postId", checkUserLike);

module.exports = router;
