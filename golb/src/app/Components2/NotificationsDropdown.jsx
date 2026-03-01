// components/NotificationsDropdown.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function NotificationsDropdown({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        🔔 Notifications ({notifications.filter(n => !n.is_read).length})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 text-white border border-gray-700 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-400">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                  notif.is_read ? "text-gray-400" : "text-white font-semibold"
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <Link href={`/Frontend/Profile/${notif.sender_id}`}>
                  <p>
                    {notif.type === "like" && `❤️ ${notif.sender_name} liked your post.`}
                    {notif.type === "comment" && `💬 ${notif.sender_name} commented on your post.`}
                    {notif.type === "follow" && `➕ ${notif.sender_name} followed you.`}
                  </p>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
