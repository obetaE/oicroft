import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Corrected reference
    type: { type: String, enum: ["pickup", "delivery"], required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, // For pickup
    deliveryAddress: { type: String }, // For delivery
  },
  { timestamps: true }
);

export default mongoose.models.Delivery || mongoose.model("Delivery", deliverySchema);
