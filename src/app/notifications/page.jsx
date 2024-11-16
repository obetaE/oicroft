import React from 'react'
import styles from "./notification.module.css"
import NotificationMessage from "@/components/NotificationMessage/NotificationMessage"
import {getNotifications} from "@/libs/Action/data"

const notification = async () => {
   const notifications = await getNotifications();

    return (
      <div className={styles.container}>
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={notification.isRead ? styles.read : styles.unread}>
            <NotificationMessage notification={notification} />
          </div>
        ))}
      </div>
    );
}

export default notification