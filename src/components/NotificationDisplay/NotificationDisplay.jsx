"use client";

import React, { useState } from "react";
import styles from "./Display.module.css";
import Link from "next/link";

const NotificationDisplay = ({ initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update notification status.");
      }

      const updatedNotification = await response.json();

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? updatedNotification : notification
        )
      );

      setError(null);
    } catch (err) {
      console.error("Error during markAsRead:", err.message || err);
      setError("Failed to update notification. Please try again.");
    }
  };

  return (
    <div className={styles.section}>
      {error && <div className={styles.error}>{error}</div>}
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={notification.isRead ? styles.read : styles.unread}
        >
          <h1 onClick={() => handleMarkAsRead(notification._id)}>
            {notification.title}
          </h1>
          <Link
            className={styles.link}
            href={`/notifications/${notification._id}`}
            onClick={() => handleMarkAsRead(notification._id)}
          >
            READ MORE
          </Link>
          <span>{new Date(notification.uploadedAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;
