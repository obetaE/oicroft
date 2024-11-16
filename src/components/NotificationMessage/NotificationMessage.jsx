import React from "react"
import Link from "next/link";
import styles from "./NotifiMess.module.css"


export default function NotificationMessage ({notification}){
    return(
        <div>
            <h1>{notification.title}</h1>
            {/* <p>{notification.desc}</p>*/}
            <Link className={styles.link} href={`/notifications/${notification._id}`}>READ MORE</Link>
            <span>{new Date(notification.uploadedAt).toLocaleString()}</span> 
            


        </div>
    )
}