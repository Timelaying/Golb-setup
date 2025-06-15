// routes/feed.routes.js
const express = require("express");
const router = express.Router();
const { fetchUserFeed } = require("../controllers/feed.controller");

router.get("/feed/:userId", fetchUserFeed);

module.exports = router;
