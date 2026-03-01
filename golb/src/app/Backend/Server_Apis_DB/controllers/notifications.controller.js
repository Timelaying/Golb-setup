// controllers/notifications.controller.js
const {
    addNotification,
    getNotifications,
    markNotificationAsRead,
  } = require("../models/notifications.model");
  
  const errorCodes = require("../utils/errorCodes");
  
  exports.createNotification = async (req, res) => {
    const { userId, type, message } = req.body;
  
    if (!userId || !type || !message) {
      return res.status(400).json(errorCodes.MISSING_FIELDS);
    }
  
    const notification = await addNotification(userId, type, message);
    res.status(201).json(notification);
  };
  
  exports.fetchNotifications = async (req, res) => {
    const { userId } = req.params;
  
    const notifications = await getNotifications(userId);
    res.status(200).json(notifications);
  };
  
  exports.markAsRead = async (req, res) => {
    const { notificationId } = req.params;
  
    const result = await markNotificationAsRead(notificationId);
    res.status(200).json({ message: "Marked as read", result });
  };
  