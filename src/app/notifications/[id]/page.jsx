import React from 'react'
import { getNotification } from "@/libs/Action/data";

const SingleNotificationPage = async ({params}) => {
    const {id} = await params;

    const notification = await getNotification(id);
  return (
    <div>
        <h1>{notification.title}</h1>
        <p>{notification.desc}</p>
    </div>
  )
}

export default SingleNotificationPage