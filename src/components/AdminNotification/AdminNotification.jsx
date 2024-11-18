import React from "react";
import styles from "./AdminNotification.module.css";
import { getNotifications } from "@/libs/Action/data";
import { deleteNotification } from "@/libs/Action/action";

const AdminNotification = async () => {
  const notifications = await getNotifications();


  return (
    <div>
      <h1>Notifications</h1>
      {notifications.map((notification) => (
        <div className={styles.notification} key={notification.id}>
          <div className={styles.details}>
            <h1>{notification.title}</h1>
            <p>{notification.body}</p>
            <span>{new Date(notification.uploadedAt).toLocaleString()}</span>
          </div>
          <form action={deleteNotification}  className={styles.Delete} >
            <input type="hidden" name="id" value={notification.id}/>
            <button>Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AdminNotification;
