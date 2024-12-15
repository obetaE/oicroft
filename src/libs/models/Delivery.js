const DeliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: { type: String, enum: ["Pickup", "Delivery"], required: true },
    region: {
      state: { type: String, required: true },
      logistics: { type: Number, required: true },
    },
    pickupLocation: {
      type: String,
      required: function () {
        return this.type === "Pickup";
      },
    },
    deliveryAddress: {
      type: String,
      required: function () {
        return this.type === "Delivery";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Delivery ||
  mongoose.model("Delivery", DeliverySchema);
