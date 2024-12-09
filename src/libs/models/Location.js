import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Location ||
  mongoose.model("Location", locationSchema);
