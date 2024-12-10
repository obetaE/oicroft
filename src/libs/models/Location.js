import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    pickup: {
      region: {
        state: { type: String }, // State name
        logistics: { type: Number }, // Logistics cost
      },
      location: {
        type: String, // Optional for pickup locations
      },
    },
    delivery: {
      region: {
        state: { type: String }, // State name
        logistics: { type: Number }, // Logistics cost
      },
      deliveryAddress: {
        type: String, // Optional for delivery locations
      },
    },
  },
  { timestamps: true } // Auto-add createdAt and updatedAt timestamps
);

const Location =
  mongoose.models?.Location || mongoose.model("Location", LocationSchema);

export default Location;
