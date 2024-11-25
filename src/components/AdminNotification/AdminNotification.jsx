import React from "react";
import styles from "./AdminNotification.module.css";
import { getNotifications } from "@/libs/Action/data";
import { deleteNotification } from "@/libs/Action/action";

const AdminNotification = async () => {
  const notifications = await getNotifications();


  return (
    <div className={styles.container} >
      <h1 className={styles.title} >Notifications</h1>
      {notifications.map((notification) => (
        <div className={styles.notification} key={notification.id}>
          <div className={styles.details}>
            <h1>{notification.title}</h1>
            <p>{notification.body}</p>
            <span>{new Date(notification.uploadedAt).toLocaleString()}</span>
          </div>
          <form action={deleteNotification}  >
            <input type="hidden" name="id" value={notification.id}/>
            <button className={styles.delete} >Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AdminNotification;
