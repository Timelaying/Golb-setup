// routes/notifications.routes.js
const express = require("express");
const router = express.Router();
const {
  addNotification,
  getNotifications,
  markNotificationAsRead,
} = require("../models/notifications.model");

// ✅ Add a new notification
router.post("/notification", async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const notification = await addNotification(userId, type, message);
    res.status(201).json(notification);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get notifications for a user
router.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await getNotifications(userId);
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Mark notification as read
router.put("/notification/:notificationId/read", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const result = await markNotificationAsRead(notificationId);
    res.status(200).json({ message: "Marked as read", result });
  } catch (err) {
    console.error("Error marking as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
