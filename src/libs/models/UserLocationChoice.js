const UserLocationChoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Must be tied to a user
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, // Must be tied to an order
    },
    option: {
      type: String,
      enum: ["Pickup", "Delivery"],
      required: true, // User must choose one
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location", // Links to the Location schema for pickup/delivery info
      required: true, // Selected pickup or delivery region
    },
    deliveryAddress: {
      type: String, // Optional, for custom delivery addresses
    },
  },
  { timestamps: true } // Auto-add createdAt and updatedAt timestamps
);

const UserLocationChoice =
  mongoose.models?.UserLocationChoice ||
  mongoose.model("UserLocationChoice", UserLocationChoiceSchema);

export default UserLocationChoice;
