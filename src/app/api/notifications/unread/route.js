import { NextResponse } from "next/server";
import NotificationModel from "@/libs/models/Notification";
import { ConnectDB } from "@/libs/config/db";

export async function GET() {
  try {
    await ConnectDB();

    // Fetch notifications where isRead is false
    const unreadNotifications = await NotificationModel.find({ isRead: false });

    return NextResponse.json({
      success: true,
      count: unreadNotifications.length,
    });
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch unread notifications." },
      { status: 500 }
    );
  }
}
