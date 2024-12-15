import NotificationModel from "@/libs/models/Notification";
import { ConnectDB } from "@/libs/config/db";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
  const { id } = await params; // Correctly access `params`

  try {
    await ConnectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid notification ID." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return new Response(
        JSON.stringify({ error: "Notification not found." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(updatedNotification), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error marking notification as read:", err.message || err);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
