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
      area: {
        zone: { type: String }, // Zone name
        cost: { type: Number }, // Logistics cost
      },
    },
    isdisabled: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true } // Auto-add createdAt and updatedAt timestamps
);

const Location =
  mongoose.models?.Location || mongoose.model("Location", LocationSchema);

export default Location;
