import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now, // Automatically sets the current date and time when the notification is created
    },
  },
  { timestamps: true }
);

const PrivacyModel =
  mongoose.models?.privacy || mongoose.model("privacy", Schema);

export default PrivacyModel;
