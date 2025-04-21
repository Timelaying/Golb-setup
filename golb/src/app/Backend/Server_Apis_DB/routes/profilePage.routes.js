// profilePage.routes.js (Refactored)

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const { handleGetProfile } = require("../controllers/profile.controller");

router.get("/profile", authenticateToken, handleGetProfile);

module.exports = router;
