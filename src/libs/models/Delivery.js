import mongoose from "mongoose"

const DeliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
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
      deliveryAddress:{
        string: { type: String}
      }
    },
  },
  { timestamps: true }
);

export default mongoose.models.Delivery ||
  mongoose.model("Delivery", DeliverySchema);
