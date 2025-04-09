// routes/follow.routes.js
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/AuthenticateMiddleware");

const {
  handleFollow,
  handleUnfollow,
  checkFollowing,
  getFollowers,
} = require("../controllers/follow.controller");

router.post("/follow/:userId", authenticateUser, handleFollow);
router.delete("/unfollow/:userId", authenticateUser, handleUnfollow);
router.get("/following/:userId", authenticateUser, checkFollowing);
router.get("/followers/:userId", getFollowers);

module.exports = router;
