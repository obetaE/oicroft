"use client";

import React, { useState } from "react";
import styles from "./Display.module.css";
import { markAsRead } from "@/libs/Action/data";
import Link from "next/link";

const NotificationDisplay = ({ initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [error, setError] = useState(null); // For error feedback

  const handleMarkAsRead = async (_id) => {
    try {
      const updatedNotification = await markAsRead(id); // Mark notification as read in the database

      if (!updatedNotification || !updatedNotification.isRead) {
        throw new Error(
          "Failed to update notification status in the database."
        );
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          String(notification._id) === String(id) // Ensure IDs match
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error("Error during markAsRead:", err.message || err);
      setError("Failed to update notification. Please try again.");
    }
  };

  return (
    <div className={styles.section}>
      {error && <div className={styles.error}>{error}</div>}{" "}
      {/* Display errors */}
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={notification.isRead ? styles.read : styles.unread}
          onClick={() => handleMarkAsRead(notification._id)} // Mark as read when clicked
        >
          <h1>{notification.title}</h1>
          <Link
            className={styles.link}
            href={`/notifications/${notification._id}`}
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
