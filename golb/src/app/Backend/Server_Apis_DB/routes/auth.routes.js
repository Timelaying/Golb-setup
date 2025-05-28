// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const {
  login,
  refreshToken,
  getCurrentUser,
  getProtected,
  testAuth // 👇 We'll add this next
} = require("../controllers/auth.controller");

router.get("/test", testAuth);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/current-user", authenticateToken, getCurrentUser);
router.get("/protected", authenticateToken, getProtected);

module.exports = router;
