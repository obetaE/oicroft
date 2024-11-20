import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
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
          unit: { type: String, required: false }, // e.g., kg, liter, big, medium, small
          price: { type: Number, required: false }, // Price per unit
          stock: { type: Number, default: 0 }, // Stock for this entry
          minQuantity: { type: Number, required: false }, // Minimum units for counter-based pricing
          pricePerUnit: { type: Number, required: false }, // Price for 1 unit in counter-based pricing
        },
      ],
      validate: {
        validator: function (arr) {
          // Each entry must have either `unit` + `price` or `minQuantity` + `pricePerUnit`
          return arr.every(
            (item) =>
              (item.unit &&
                item.price &&
                !item.minQuantity &&
                !item.pricePerUnit) ||
              (!item.unit &&
                !item.price &&
                item.minQuantity &&
                item.pricePerUnit)
          );
        },
        message:
          "Each price entry must include either `unit` and `price` OR `minQuantity` and `pricePerUnit`, but not both.",
      },
      required: false,
    },
    productId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    discounts: {
      regularDiscount: { type: Number, default: 0 }, // Percentage or flat value
      promoCodes: {
        type: [
          {
            code: { type: String, required: true }, // Promo code string
            discountValue: { type: Number, required: true }, // Discount associated with code
          },
        ],
        default: [],
      },
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models?.Product || mongoose.model("Product", ProductSchema);
