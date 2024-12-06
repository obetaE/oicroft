import React from "react";
import styles from "./notification.module.css";
import NotificationDisplay from "@/components/NotificationDisplay/NotificationDisplay"; // Client Component
import { getNotifications } from "@/libs/Action/data";
import Navbar from "@/components/Navbar/Navbar";

const notification = async () => {
  const notifications = await getNotifications(); // Fetch notifications on the server

  return (
    <div className={styles.container}>
      <div className={styles.notificationbg}>
        <Navbar />
        <div className={styles.section}>
          <NotificationDisplay initialNotifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default notification;
