"use client";

import React, { useState } from "react";
import styles from "./Display.module.css";
import { markAsRead } from "@/libs/Action/data";
import Link from "next/link";

const NotificationDisplay = ({ initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id); // Mark the notification as read in the database

      // Update the local state to reflect the change
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          String(notification._id) === String(id) // Ensure IDs match correctly
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className={styles.section}>
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={notification.isRead ? styles.read : styles.unread}
          onClick={() => handleMarkAsRead(notification._id)} // Mark as read when clicked
        >
          <h1>{notification.title}</h1>
          {/* <p>{notification.desc}</p>*/}
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
