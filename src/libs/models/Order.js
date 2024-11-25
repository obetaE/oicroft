import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., "kg", "liter", "big"
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date, required: true },
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