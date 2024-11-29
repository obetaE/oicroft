import React from 'react'
import styles from "./notification.module.css"
import NotificationMessage from "@/components/NotificationMessage/NotificationMessage"
import {getNotifications} from "@/libs/Action/data"
import Navbar from "@/components/Navbar/Navbar";

const notification = async () => {
   const notifications = await getNotifications();

    return (
      <div className={styles.container}>
        <div className={styles.notificationbg}>
          <Navbar/>
          <div className={styles.section}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={notification.isRead ? styles.read : styles.unread}
              >
                <NotificationMessage notification={notification} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default notification