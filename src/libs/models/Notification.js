import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now, // Automatically sets the current date and time when the notification is created
    },
    isRead: { type: Boolean, default: false }, // New field
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const NotificationModel =
  mongoose.models?.Notification || mongoose.model("Notification", Schema);

export default NotificationModel;
