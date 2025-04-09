const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/AuthenticateMiddleware");
const {
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  testAuth,
  protectedRoute
} = require("../controllers/auth.controller");

// Test Route
router.get("/test", testAuth);

// Auth Routes
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", authenticateToken, getCurrentUser);

// Example Protected Route
router.get("/protected", authenticateToken, protectedRoute);

module.exports = router;
