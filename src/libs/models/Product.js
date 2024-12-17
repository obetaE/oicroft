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
          type: { type: String, required: true, enum: ["unit", "counter"] }, // Pricing type
          unit: {
            type: String,
            required: function () {
              return this.type === "unit";
            },
          }, // Unit-based pricing
          price: {
            type: Number,
            required: function () {
              return this.type === "unit";
            },
          },
          stock: { type: Number, default: 0 }, // Stock for this entry
          minQuantity: {
            type: Number,
            required: function () {
              return this.type === "counter"; // Still required for "counter" type
            },
          }, // Optional for unit-based pricing
          pricePerUnit: {
            type: Number,
            required: function () {
              return this.type === "counter";
            },
          }, // Counter-based pricing
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.every(
            (item) =>
              (item.type === "unit" &&
                item.unit &&
                item.price &&
                (item.minQuantity === undefined || item.minQuantity >= 0)) || // Allow minQuantity for unit
              (item.type === "counter" && item.minQuantity && item.pricePerUnit)
          );
        },
        message:
          "Each price entry must have valid fields for its type ('unit' or 'counter').",
      },
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId type
      unique: true,
      default: () => new mongoose.Types.ObjectId(), // Generates a valid ObjectId
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
  },
  { timestamps: true }
);

export const Product =
  mongoose.models?.Product || mongoose.model("Product", ProductSchema);

  
{
  /* 
    What's happening?
    Explanation
Unified Field (prices):

Allows entries for both regular pricing (unit + price) and counter-based pricing (minQuantity + pricePerUnit).
This keeps everything in one place, making the schema cleaner and easier to manage.
Validation Logic:

Ensures that each entry in the prices array has either:
unit and price (for standard pricing), OR
minQuantity and pricePerUnit (for counter-based pricing).
Prevents invalid combinations like having both unit + minQuantity in the same entry.
Flexible Structure:

Products can mix multiple pricing options, such as having "1kg for $10" alongside "minQuantity 5 for $8/unit."
Optional Fields:

prices is not strictly required for all products, allowing for edge cases if needed.
Example Data
This schema can handle the following scenarios:

Standard Pricing
json
Copy code
{
  "title": "Yam",
  "desc": "Fresh yams",
  "img": "/images/yam.jpg",
  "prices": [
    { "unit": "kg", "price": 5, "stock": 50 },
    { "unit": "tuber", "price": 2, "stock": 100 }
  ]
}
Counter-Based Pricing
json
Copy code
{
  "title": "Bottled Water",
  "desc": "Bulk bottled water",
  "img": "/images/water.jpg",
  "prices": [
    { "minQuantity": 10, "pricePerUnit": 1, "stock": 500 }
  ]
}
Mixed Pricing
json
Copy code
{
  "title": "Rice",
  "desc": "Premium quality rice",
  "img": "/images/rice.jpg",
  "prices": [
    { "unit": "kg", "price": 3, "stock": 200 },
    { "minQuantity": 50, "pricePerUnit": 2.5, "stock": 1000 }
  ]
}
Why This Works
Simplified Validation: All pricing logic is centralized, making it easier to debug and manage.
Flexibility: You can define products with any combination of pricing options without overcomplicating the schema.
Consistency: Developers only need to understand one structure (prices) instead of managing two (prices and counter).
Let me know if you need further clarification, or feel free to test it out and share your thoughts
    */
}
