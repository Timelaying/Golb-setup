// models/notifications.model.js
const pool = require("../db");

// Add notification
async function addNotification(userId, type, data) {
  const query = `
    INSERT INTO notifications (user_id, type, data)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, type, data]);
  return result.rows[0];
}

// Get all notifications for a user
async function getNotifications(userId) {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Mark a notification as read
async function markNotificationAsRead(notificationId) {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [notificationId]);
  return result.rows[0];
}

module.exports = {
  addNotification,
  getNotifications,
  markNotificationAsRead,
};
