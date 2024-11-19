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
          unit: { type: String, required: true }, // Flexible measurement (e.g., kg, liter, big, medium, small)
          price: { type: Number, required: true }, // Price per unit
        },
      ],
      validate: [(arr) => arr.length > 0, "Prices array cannot be empty"],
    },
    productId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(), // Auto-generate unique ID
    },
    counter: {
      minQuantity: { type: Number, required: false }, // Minimum units to order
      pricePerUnit: { type: Number, required: false }, // Price for 1 unit
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


{
  /* 
  AN EXPLANATION OF ALL THAT'S HERE EXCEPT THE OBVIOUS ONES
  Key Adjustments:
Prices Array:

Each entry includes unit and price, allowing the admin to define as many units and their prices as needed (e.g., "25L, $20", "50L, $40").
Flexible for all unit types: liters, kg, big, small, etc.
Product ID:

Defaults to an auto-generated value but can be manually set if needed.
No need to overcomplicate unless there's a specific reason for manual IDs.
Counter Field:

Optional. Holds minQuantity and pricePerUnit for counter-based products.
Provides a baseline for calculations outside the schema.
Discounts:

regularDiscount for static discounts set by the admin.
promoCodes as an array of promo codes and their discount values.
Totals and Order Tracking:

This doesn’t belong in the product schema. Instead:
Orders Schema: Create a separate schema to log orders, quantities, and timestamps.
This decouples product definition from transactional data, simplifying maintenance and reporting.

  */
}