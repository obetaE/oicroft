import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema(
  {
    img: { type: String, required: true }, // Each entry is a single image URL
  },
  { timestamps: true }
);

export const Slider =
  mongoose.models.Slider || mongoose.model("Slider", SliderSchema);
