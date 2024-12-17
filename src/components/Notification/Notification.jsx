"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Notification.module.css";

export default function Notification() {
  const router = useRouter();
  const [hasUnread, setHasUnread] = useState(false);

  const checkUnreadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/unread");
      const data = await response.json();

      if (data.success) {
        setHasUnread(data.count > 0); // Set to true if there are unread notifications
      }
    } catch (error) {
      console.error("Error checking unread notifications:", error);
    }
  };

  useEffect(() => {
    checkUnreadNotifications();
  }, []);

  const goToNotifications = () => {
    router.push("/notifications");
  };

  return (
    <button
      onClick={goToNotifications}
      className={`${styles.links} ${hasUnread ? styles.unread : ""}`}
    >
      <Image
        alt="Notification Icon"
        src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/notification_sb8sqk.png"
        className={styles.linkimage}
        width={40}
        height={40}
      />
      {hasUnread && <span className={styles.badge}></span>}
    </button>
  );
}
