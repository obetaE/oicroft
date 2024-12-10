import mongoose from "mongoose";

const ComboSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 200,
    },
    img: {
      type: String,
      required: true,
    },
    prices: {
      type: [
        {
          pricingType: { type: String, required: true, enum: ["counter"] },
          stock: { type: Number, default: 0 },
          minQuantity: { type: Number, required: true },
          pricePerUnit: { type: Number, required: true },
        },
      ],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    discounts: {
      regularDiscount: { type: Number, default: 0 },
      promoCodes: {
        type: [
          {
            code: { type: String, required: true },
            discountValue: { type: Number, required: true },
          },
        ],
        default: [],
      },
    },
    maxQuantity: {
      type: Number,
      default: null,
    },
    orderCooldown: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export const Combo =
  mongoose.models?.Combo || mongoose.model("Combo", ComboSchema);
