import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    reference: { type: String, required: true, unique: true },
    products: {
      type: [
        {
          productId: { type: String, required: true },
          title: { type: String, required: true },
          quantity: { type: Number, required: true },
          unit: { type: String, required: false }, // Optional for counter-based products
          price: { type: Number, required: true },
          totalPrice: { type: Number, required: true },
        },
      ],
      required: true,
    },
    total: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    otpToken: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", OrderSchema);


  {
    /* OLD CODE FOR REFERENCE I GUESS
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
        unit: { type: String, required: tr },
        totalPrice: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    orderDate: { type: Date, default: Date.now },
    otpToken: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", OrderSchema);

    */
  }