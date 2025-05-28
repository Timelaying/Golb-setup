// routes/notifications.routes.js
const express = require("express");
const router = express.Router();

const {
  createNotification,
  fetchNotifications,
  markAsRead,
} = require("../controllers/notifications.controller");

router.post("/notification", createNotification);
router.get("/notifications/:userId", fetchNotifications);
router.put("/notification/:notificationId/read", markAsRead);

module.exports = router;
