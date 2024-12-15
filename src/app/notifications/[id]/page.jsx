import React from "react";
import { getNotification } from "@/libs/Action/data";

const SingleNotificationPage = async ({ params }) => {
  const { id } = await params;

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    // Fetch the notification data
    const notification = await getNotification(id);

    // Mark notification as read
    await fetch(`${API_BASE_URL}/api/notifications/${id}`, { method: "PATCH" });

    return (
      <div>
        <h1>{notification.title}</h1>
        <p>{notification.desc}</p>
      </div>
    );
  } catch (error) {
    console.error("Error fetching or updating notification:", error.message);
    return (
      <div>
        <h1>Error loading notification</h1>
        <p>Please try again later.</p>
      </div>
    );
  }
};

export default SingleNotificationPage;
