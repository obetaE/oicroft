import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import NotificationForm from "@/components/NotificationForm/NotificationForm";
import AdminNotification from "@/components/AdminNotification/AdminNotification";
import styles from "../admin.module.css";

const NotificationsPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <div className={styles.usersection}>
          <Navbar />
          <h1 className={styles.userTitle} >Notification Management</h1>
          <div className={styles.row}>
            <div className={styles.col}>
              <AdminNotification />
            </div>
            <div className={styles.col}>
              <NotificationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
