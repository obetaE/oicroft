import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", OrderSchema);

{
  /*
    WHAT THIS SCHEMA DOES
    This schema allows you to track:

Quantities ordered per unit.
Total sales over a timeframe.
The delivery cycle you described (Mon-Wed ordering, delivery Thurs-Sun).
    */
}
