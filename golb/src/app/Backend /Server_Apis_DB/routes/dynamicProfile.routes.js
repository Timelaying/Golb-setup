// routes/dynamicProfile.routes.js
const express = require("express");
const router = express.Router();
const { getUserProfileAndPosts } = require("../controllers/dynamicProfile.controller");

router.get("/users/:username", getUserProfileAndPosts);

module.exports = router;
