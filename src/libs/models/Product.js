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
    // prices array allows different prices for various options
    prices: {
      type: [Number],
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },

        // The measurements object includes:
    // unit: A string that accepts specific units (kg, liter, count) to match your requirements. The enum keyword ensures only these values are allowed.
    // value: A numeric value associated with the unit. This allows flexible quantities, like 70 for count (70 tubers) or 5 for kg.

    measurements: {
      type: {
        unit: {
          type: String,
          enum: ["kg", "liter", "count"], // Specific units
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        price: { type: Number, required: true }, // Price for this measurement
      },
    },

    // Sizes field with different prices based on size chosen
    sizes: {
      type: [
        {
          size: {
            type: String,
            enum: ["big", "medium", "small"], // Specific size options
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      required: false, // Not all products require sizes
    },

    extraOptions: {
      type: [
        {
          text: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models?.Product || mongoose.model("Product", ProductSchema);

