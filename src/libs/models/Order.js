import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    products: {
      type: [
        {
          productId: { type: String, required: true },
          title: { type: String, required: true },
          quantity: { type: Number, required: true },
          unit: { type: String, required: false },
          price: { type: Number, required: true },
          totalPrice: { type: Number, required: true },
        },
      ],
      required: true,
    },
    total: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    otpToken: { type: Number, required: true },
    status: { type: String, default: "Paid" },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", OrderSchema);
