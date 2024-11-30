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

const TocModel =
  mongoose.models?.toc || mongoose.model("toc", Schema);

export default TocModel;
