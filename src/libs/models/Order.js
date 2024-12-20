import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "user",
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Product, Animal, or Combo
            required: true,
          },
          productType: {
            type: String,
            required: true,
            enum: ["Product", "Animal", "Combo"], // Allowed product types
          },
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
      deliveryAddress: {
        string: { type: String },
      },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", OrderSchema);
